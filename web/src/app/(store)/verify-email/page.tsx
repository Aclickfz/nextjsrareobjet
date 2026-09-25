import { AuthShell } from '@/components/account/AuthShell';
import { EmailRequestForm, VerifyEmailForm } from '@/components/account/RecoveryForms';
import { safeNextPath, validToken } from '@/lib/auth-validation';
export const metadata = { title: 'Verify email', robots: { index: false, follow: false }, referrer: 'no-referrer' as const };
export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string; next?: string }> }) {
  const { token = '', next = '' } = await searchParams;
  const back = safeNextPath(next);
  return <AuthShell title="Verify your email">{validToken(token) ? <VerifyEmailForm token={token} next={back} /> : <p>Request a verification email below, then open the link in your inbox.</p>}<EmailRequestForm purpose="verify" next={back} /></AuthShell>;
}
