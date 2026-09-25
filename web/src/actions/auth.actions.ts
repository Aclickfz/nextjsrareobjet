'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { getPool, query } from '@/lib/db';
import { clearAuthCookie, currentUser, getSessionId, safeNextPath, setAuthCookie, signToken, redirectIfAuthenticated } from '@/lib/auth';
import { validEmail, validPassword, validToken } from '@/lib/auth-validation';
import { allowAuthAttempt, consumeAuthToken, issueAuthEmail } from '@/lib/auth-tokens';
import { emailConfiguration } from '@/lib/auth-email';
import { mergeGuestCart } from '@/repositories/cart.repository';
import type { ResultSetHeader } from 'mysql2/promise';

type AuthState = { error?: string; message?: string } | undefined;

export async function registerAction(_state: AuthState, formData: FormData) {
  await redirectIfAuthenticated(safeNextPath(formData.get('next')));
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const phone = String(formData.get('phone') || '').trim();
  const password = String(formData.get('password') || '');
  if (!name || name.length > 200 || !validEmail(email) || !phone || !validPassword(password)) return { error: 'Enter your name, valid email, phone and a password of at least 8 characters (at most 72 bytes).' };
  if (phone.length > 40) return { error: 'Phone number is too long' };
  if (!await allowAuthAttempt('register', email, 5, 900)) return { error: 'Too many attempts. Please try again in 15 minutes.' };
  try { emailConfiguration(); } catch { return { error: 'Email service is unavailable. Please try again later.' }; }
  const existing = await query<{ id: number }[]>('SELECT id FROM users WHERE email = :email LIMIT 1', { email });
  if (existing.length) return { error: 'Email already registered. Sign in with your password.' };
  const password_hash = await bcrypt.hash(password, 10);
  let result: ResultSetHeader;
  try { [result] = await getPool().execute<ResultSetHeader>(
    `INSERT INTO users (name, email, phone, password_hash, role) VALUES (:name, :email, :phone, :password_hash, 'customer')`,
    { name, email, phone, password_hash }
  ); } catch (error) {
    if ((error as { code?: string }).code === 'ER_DUP_ENTRY') return { error: 'Email already registered. Sign in with your password.' };
    throw error;
  }
  try { await issueAuthEmail(result.insertId, email, 'verify', safeNextPath(formData.get('next'))); }
  catch { return { error: 'Your account was created, but the email could not be sent. Use Resend verification email to try again.' }; }
  return { message: 'Account created. Open the verification email, confirm your email address, then sign in.' };
}

export async function loginAction(_state: AuthState, formData: FormData) {
  await redirectIfAuthenticated(safeNextPath(formData.get('next')));
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  if (!validEmail(email) || !password || Buffer.byteLength(password) > 72) return { error: 'Invalid email or password' };
  if (!await allowAuthAttempt('login', email, 10, 900)) return { error: 'Too many attempts. Please try again in 15 minutes.' };
  const rows = await query<{ id: number; name: string; email: string; role: string; password_hash: string; email_verified_at: string | null; session_version: number }[]>(
    'SELECT id, name, email, role, password_hash, email_verified_at, session_version FROM users WHERE email = :email LIMIT 1',
    { email }
  );
  const row = rows[0];
  if (!row || !(await bcrypt.compare(password, row.password_hash))) return { error: 'Invalid email or password' };
  if (!row.email_verified_at) return { error: 'Verify your email before signing in. Use Resend verification email below to get a link.' };
  await mergeGuestCart(row.id, await getSessionId());
  await setAuthCookie(signToken(row));
  if (row.role === 'admin') redirect('/admin/dashboard');
  redirect(safeNextPath(formData.get('next')) || '/account/orders');
}

export async function forgotPasswordAction(_state: AuthState, formData: FormData) {
  return requestEmail(formData, 'reset');
}

export async function resendVerificationAction(_state: AuthState, formData: FormData) {
  return requestEmail(formData, 'verify');
}

async function requestEmail(formData: FormData, purpose: 'verify' | 'reset') {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  if (!validEmail(email)) return { error: 'Enter a valid email address.' };
  if (!await allowAuthAttempt(`request-${purpose}`, email, 5, 900)) return { error: 'Too many requests. Please try again in 15 minutes.' };
  try { emailConfiguration(); } catch { return { error: 'Email service is unavailable. Please try again later.' }; }
  const rows = await query<{ id: number; email_verified_at: string | null }[]>('SELECT id, email_verified_at FROM users WHERE email = :email', { email });
  const user = rows[0];
  if (user && (purpose === 'reset' || !user.email_verified_at)) {
    try { await issueAuthEmail(user.id, email, purpose, safeNextPath(formData.get('next'))); }
    catch { console.error('Authentication email delivery failed'); }
  }
  return { message: 'If the account is eligible, an email will arrive shortly. Check your inbox and spam folder. Wait a minute before requesting another link.' };
}

export async function verifyEmailAction(_state: AuthState, formData: FormData) {
  const token = String(formData.get('token') || '');
  if (!validToken(token)) return { error: 'Invalid verification link. Request a new link below.' };
  if (!await allowAuthAttempt('verify-consume', token, 10, 900)) return { error: 'Too many attempts. Please try again later.' };
  const id = await consumeAuthToken(token, 'verify');
  if (!id) return { error: 'This verification link is invalid, expired or already used. Request a new link below.' };
  // Verification proves mailbox ownership; password login avoids signing into an
  // account whose password might have been chosen by somebody else.
  const next = safeNextPath(formData.get('next'));
  redirect(`/login?verified=1${next ? `&next=${encodeURIComponent(next)}` : ''}`);
}

export async function resetPasswordAction(_state: AuthState, formData: FormData) {
  const password = String(formData.get('password') || '');
  if (!validPassword(password)) return { error: 'Use at least 8 characters and at most 72 bytes.' };
  if (password !== String(formData.get('confirmPassword') || '')) return { error: 'Passwords do not match.' };
  const token = String(formData.get('token') || '');
  if (!validToken(token)) return { error: 'Invalid reset link. Request a new one.' };
  if (!await allowAuthAttempt('reset-consume', token, 10, 900)) return { error: 'Too many attempts. Request a new reset link.' };
  const id = await consumeAuthToken(token, 'reset', await bcrypt.hash(password, 12));
  if (!id) return { error: 'This reset link is invalid, expired or already used. Request a new one.' };
  await clearAuthCookie();
  redirect('/login?reset=1');
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
