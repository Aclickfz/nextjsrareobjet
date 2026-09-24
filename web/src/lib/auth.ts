import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { query } from './db';

export type SessionUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  notes: string | null;
};

const cookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.COOKIE_SECURE === 'true',
  path: '/'
};

export function signToken(user: { id: number; role: string; email: string; name: string }) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' }
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

export function safeNextPath(value: FormDataEntryValue | null) {
  const next = String(value || '');
  if (next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/admin')) return next;
  return '';
}

export async function currentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get('token')?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret') as { id: number };
    const rows = await query<SessionUser[]>(
      'SELECT id, name, email, role, phone, notes FROM users WHERE id = :id LIMIT 1',
      { id: payload.id }
    );
    return rows[0] || null;
  } catch {
    return null;
  }
}
