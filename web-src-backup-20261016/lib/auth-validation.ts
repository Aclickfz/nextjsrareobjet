export function safeNextPath(value: FormDataEntryValue | null) {
  const next = String(value || '');
  if (!next.startsWith('/') || /[\\\s\x00-\x1f]/.test(next) || next.startsWith('//')) return '';
  const url = new URL(next, 'https://local.invalid');
  if (/^\/(admin|login|register|forgot-password|reset-password|verify-email)(\/|$)/.test(url.pathname)) return '';
  return url.pathname + url.search + url.hash;
}

export const validEmail = (email: string) => email.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validPassword = (password: string) => password.length >= 8 && Buffer.byteLength(password, 'utf8') <= 72;
export const validToken = (token: string) => /^[a-f0-9]{64}$/.test(token);
