import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const response = NextResponse.next();
  const pathname = new URL(request.url).pathname;
  if (['/verify-email', '/reset-password'].includes(pathname)) {
    response.headers.set('Referrer-Policy', 'no-referrer');
    response.headers.set('Cache-Control', 'no-store');
  }
  const sid = request.headers.get('cookie')?.match(/(?:^|; )sid=([^;]+)/);
  if (!sid) {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const value = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    response.cookies.set('sid', value, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      path: '/',
      maxAge: 30 * 24 * 60 * 60
    });
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|assets|uploads|favicon.ico).*)']
};
