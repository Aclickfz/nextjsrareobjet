import nodemailer from 'nodemailer';

export function emailConfiguration() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD;
  const from = process.env.AUTH_EMAIL_FROM?.trim() || user;
  const origin = new URL(process.env.NEXT_PUBLIC_APP_URL || '');
  if (!host || !user || !pass || !from || ![465, 587].includes(port) || !['http:', 'https:'].includes(origin.protocol)) {
    throw new Error('Authentication SMTP is not configured');
  }
  if (process.env.NODE_ENV === 'production' && origin.protocol !== 'https:') throw new Error('HTTPS is required');
  return { from, origin: origin.origin, smtp: {
    host, port, secure: port === 465, requireTLS: port === 587,
    auth: { user, pass },
    connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 20000,
    disableFileAccess: true, disableUrlAccess: true
  } };
}

export async function sendAuthEmail(email: string, token: string, purpose: 'verify' | 'reset', next: string) {
  const { smtp, from, origin } = emailConfiguration();
  const url = new URL(purpose === 'verify' ? '/verify-email' : '/reset-password', origin);
  url.searchParams.set('token', token);
  if (next) url.searchParams.set('next', next);
  const title = purpose === 'verify' ? 'Verify your email' : 'Reset your password';
  const expiry = purpose === 'verify' ? '24 hours' : '30 minutes';
  const link = url.toString().replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const transport = nodemailer.createTransport(smtp);
  const result = await transport.sendMail({
    from, to: email, subject: `${title} - JustAclick`,
    text: `${title}: ${url.toString()}\nThis link expires in ${expiry}. If you did not request it, ignore this email.`,
    html: `<h1>${title}</h1><p><a href="${link}" style="display:inline-block;padding:14px 22px;background:#131313;color:white;border-radius:6px">${title}</a></p><p>This link expires in ${expiry}. If you did not request it, ignore this email.</p>`
  });
  if (!result.accepted.length || result.rejected.length) throw new Error('Email delivery failed');
}
