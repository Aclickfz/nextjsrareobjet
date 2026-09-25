import { createHash, randomBytes } from 'node:crypto';
import type { ResultSetHeader } from 'mysql2/promise';
import { getPool, query } from './db';
import { validToken } from './auth-validation';
import { sendAuthEmail } from './auth-email';

export const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');

// Shared database counters work across application instances.
export async function allowAuthAttempt(scope: string, identity: string, limit: number, seconds: number) {
  const bucket = Math.floor(Date.now() / (seconds * 1000));
  const key = tokenHash(`${scope}:${identity}:${bucket}`);
  await getPool().execute('INSERT INTO auth_rate_limits (bucket_key, attempts, expires_at) VALUES (:key, 1, DATE_ADD(UTC_TIMESTAMP(), INTERVAL :seconds SECOND)) ON DUPLICATE KEY UPDATE attempts = attempts + 1', { key, seconds });
  const rows = await query<{ attempts: number }[]>('SELECT attempts FROM auth_rate_limits WHERE bucket_key = :key', { key });
  await getPool().execute('DELETE FROM auth_rate_limits WHERE expires_at < UTC_TIMESTAMP() LIMIT 100');
  return rows[0].attempts <= limit;
}

export async function issueAuthEmail(userId: number, email: string, purpose: 'verify' | 'reset', next = '') {
  if (!await allowAuthAttempt(`mail-${purpose}`, String(userId), 1, 60)) return;
  const token = randomBytes(32).toString('hex');
  const hash = tokenHash(token);
  await getPool().execute('INSERT INTO auth_tokens (user_id, purpose, token_hash, expires_at) VALUES (:userId, :purpose, :hash, DATE_ADD(UTC_TIMESTAMP(), INTERVAL :seconds SECOND))',
    { userId, purpose, hash, seconds: purpose === 'verify' ? 86400 : 1800 });
  try {
    await sendAuthEmail(email, token, purpose, next);
  } catch (error) {
    await getPool().execute('DELETE FROM auth_tokens WHERE token_hash = :hash', { hash });
    throw error;
  }
}

export async function consumeAuthToken(token: string, purpose: 'verify' | 'reset', passwordHash?: string) {
  if (!validToken(token)) return null;
  const hash = tokenHash(token);
  const candidates = await query<{ user_id: number }[]>('SELECT user_id FROM auth_tokens WHERE token_hash = :hash AND purpose = :purpose', { hash, purpose });
  if (!candidates[0]) return null;
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    // Serialize all token consumption for this user, including different reset links.
    await conn.execute('SELECT id FROM users WHERE id = :id FOR UPDATE', { id: candidates[0].user_id });
    const [result] = await conn.execute<ResultSetHeader>('DELETE FROM auth_tokens WHERE token_hash = :hash AND purpose = :purpose AND expires_at > UTC_TIMESTAMP()', { hash, purpose });
    if (!result.affectedRows) { await conn.rollback(); return null; }
    const id = candidates[0].user_id;
    if (purpose === 'verify') {
      await conn.execute('UPDATE users SET email_verified_at = COALESCE(email_verified_at, UTC_TIMESTAMP()) WHERE id = :id', { id });
    } else {
      if (!passwordHash) throw new Error('Password is required');
      await conn.execute('UPDATE users SET password_hash = :passwordHash, email_verified_at = COALESCE(email_verified_at, UTC_TIMESTAMP()), session_version = session_version + 1 WHERE id = :id', { id, passwordHash });
      await conn.execute("DELETE FROM auth_tokens WHERE user_id = :id AND purpose = 'verify'", { id });
    }
    await conn.execute('DELETE FROM auth_tokens WHERE user_id = :id AND purpose = :purpose', { id, purpose });
    await conn.commit();
    return id;
  } catch (error) { await conn.rollback(); throw error; }
  finally { conn.release(); }
}
