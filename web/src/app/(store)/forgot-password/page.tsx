import { AuthShell } from '@/components/account/AuthShell';
import { EmailRequestForm } from '@/components/account/RecoveryForms';
import { redirectIfAuthenticated } from '@/lib/auth';
export const metadata = { title: 'Forgot password', robots: { index: false, follow: false } };
export default async function ForgotPasswordPage() {
  await redirectIfAuthenticated();
  return <AuthShell title="Forgot your password?"><p>Enter your email to receive a password reset link.</p><EmailRequestForm purpose="reset" /></AuthShell>;
}
