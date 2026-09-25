import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { query } from './db';
import { redirect } from 'next/navigation';
import { safeNextPath } from './auth-validation';
export { safeNextPath } from './auth-validation';

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  notes: string | null;
  session_version: number;
};

const cookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.COOKIE_SECURE === 'true',
  path: '/'
};

function secret() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
  return process.env.JWT_SECRET;
}

export function signToken(user: { id: number; session_version: number }) {
  return jwt.sign(
    { id: user.id, version: user.session_version },
    secret(),
    { expiresIn: '7d', algorithm: 'HS256' }
  );
}

export async function setAuthCookie(token: string) {
  const jar = await cookies();
  jar.set('token', token, { ...cookieBase, maxAge: 7 * 24 * 60 * 60 });
}

export async function clearAuthCookie() {
  const jar = await cookies();
  jar.set('token', '', { ...cookieBase, maxAge: 0 });
}

export async function getSessionId() {
  const jar = await cookies();
  return jar.get('sid')?.value || '';
}

export async function redirectIfAuthenticated(next = '') {
  const user = await currentUser();
  if (user) redirect(user.role === 'admin' ? '/admin/dashboard' : safeNextPath(next) || '/account/orders');
}

export async function currentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get('token')?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, secret(), { algorithms: ['HS256'] }) as { id: number; version: number };
    if (!Number.isSafeInteger(payload.id) || !Number.isSafeInteger(payload.version)) return null;
    const rows = await query<SessionUser[]>(
      'SELECT id, name, email, role, phone, notes, session_version FROM users WHERE id = :id AND session_version = :version AND email_verified_at IS NOT NULL LIMIT 1',
      { id: payload.id, version: payload.version }
    );
    return rows[0] || null;
  } catch {
    return null;
  }
}
