'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { getPool, query } from '@/lib/db';
import { clearAuthCookie, currentUser, getSessionId, safeNextPath, setAuthCookie, signToken } from '@/lib/auth';
import { mergeGuestCart } from '@/repositories/cart.repository';
import type { ResultSetHeader } from 'mysql2/promise';

export async function registerAction(_state: { error?: string } | undefined, formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const phone = String(formData.get('phone') || '').trim();
  const password = String(formData.get('password') || '');
  if (!name || !email || !phone || password.length < 6) return { error: 'Name, email, phone number and password (min 6 chars) are required' };
  if (phone.length > 40) return { error: 'Phone number is too long' };
  const existing = await query<{ id: number }[]>('SELECT id FROM users WHERE email = :email LIMIT 1', { email });
  if (existing.length) return { error: 'Email already registered' };
  const password_hash = await bcrypt.hash(password, 10);
  const [result] = await getPool().execute<ResultSetHeader>(
    `INSERT INTO users (name, email, phone, password_hash, role) VALUES (:name, :email, :phone, :password_hash, 'customer')`,
    { name, email, phone, password_hash }
  );
  await mergeGuestCart(result.insertId, await getSessionId());
  await setAuthCookie(signToken({ id: result.insertId, name, email, role: 'customer' }));
  redirect(safeNextPath(formData.get('next')) || '/account/orders');
}

export async function loginAction(_state: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const rows = await query<{ id: number; name: string; email: string; role: string; password_hash: string }[]>(
    'SELECT id, name, email, role, password_hash FROM users WHERE email = :email LIMIT 1',
    { email }
  );
  const row = rows[0];
  if (!row || !(await bcrypt.compare(password, row.password_hash))) return { error: 'Invalid email or password' };
  await mergeGuestCart(row.id, await getSessionId());
  await setAuthCookie(signToken(row));
  if (row.role === 'admin') redirect('/admin/dashboard');
  redirect(safeNextPath(formData.get('next')) || '/account/orders');
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect('/');
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/');
  return user;
}
