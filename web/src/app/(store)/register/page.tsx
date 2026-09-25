import { redirectIfAuthenticated, safeNextPath } from '@/lib/auth';
import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/account/AuthShell';
import { RegisterForm } from '@/components/account/AuthForms';

export const metadata: Metadata = { title: 'Create account', description: 'Create your JustAclick account to save favourites and manage your shopping experience.' };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string; verified?: string; reset?: string }> }) {
  const { next } = await searchParams;
  const back = safeNextPath(next || '');
  await redirectIfAuthenticated(back);
  return <AuthShell mode="register" title="Make yourself at home." description="Create your account for saved favourites and effortless order tracking.">
    <RegisterForm next={back} />
    <div className="auth-switch">Already have an account? <Link href={back ? `/login?next=${encodeURIComponent(back)}` : '/login'}>Sign in</Link></div>
    <p className="auth-secondary">Need a new link? <Link href={`/verify-email?next=${encodeURIComponent(back)}`}>Resend verification</Link></p>
  </AuthShell>;
}
