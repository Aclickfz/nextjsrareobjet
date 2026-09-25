import { redirectIfAuthenticated, safeNextPath } from '@/lib/auth';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/account/AuthShell';
import { NoticeToast } from '@/components/ui/ToastProvider';
import { LoginForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Sign in', description: 'Sign in to your JustAclick account.' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; verified?: string; reset?: string }> }) {
  const { next, verified, reset } = await searchParams;
  const back = safeNextPath(next || '');
  await redirectIfAuthenticated(back);
  return <AuthShell mode="login" title="Welcome home." description="Sign in to explore your favourites and keep track of your orders.">
    <NoticeToast message={verified === '1' ? 'Email verified. Sign in to continue.' : reset === '1' ? 'Password reset. Sign in with your new password.' : ''} />
    <LoginForm next={back} />
    <div className="auth-switch">New to JustAclick? <Link href={back ? `/register?next=${encodeURIComponent(back)}` : '/register'}>Create an account</Link></div>
    <p className="auth-secondary">Waiting for your email? <Link href={`/verify-email?next=${encodeURIComponent(back)}`}>Resend verification</Link></p>
  </AuthShell>;
}
