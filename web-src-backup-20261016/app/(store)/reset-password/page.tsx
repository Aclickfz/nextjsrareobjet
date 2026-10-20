import Link from 'next/link';
import { AuthShell } from '@/components/account/AuthShell';
import { ResetPasswordForm } from '@/components/account/RecoveryForms';
import { validToken } from '@/lib/auth-validation';
export const metadata = { title: 'Reset password', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = '' } = await searchParams;
  return <AuthShell title="Reset your password">{validToken(token) ? <ResetPasswordForm token={token} /> : <p>Invalid reset link. <Link href="/forgot-password">Request a new link</Link></p>}</AuthShell>;
}
