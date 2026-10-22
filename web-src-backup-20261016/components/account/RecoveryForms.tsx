'use client';

import { useAuthAction } from './useAuthAction';
import Link from 'next/link';
import { PasswordField } from './PasswordField';
import { ActionFeedback } from '@/components/ui/ToastProvider';
import { forgotPasswordAction, resendVerificationAction, resetPasswordAction, verifyEmailAction } from '@/actions/auth.actions';

export function EmailRequestForm({ purpose, next = '' }: { purpose: 'verify' | 'reset'; next?: string }) {
  const [state, action, pending] = useAuthAction(purpose === 'verify' ? resendVerificationAction : forgotPasswordAction);
  return <form className="sign_form" action={action} aria-busy={pending}>
    <input type="hidden" name="next" value={next} />
    <div className="sign_input"><label htmlFor="request-email">Email address</label><input id="request-email" name="email" type="email" autoComplete="email" maxLength={200} required /></div>
    <button className="sign_submit" disabled={pending}>{pending ? 'Sending…' : purpose === 'verify' ? 'Resend verification email' : 'Send password reset link'}</button>
    <ActionFeedback state={state} />
  </form>;
}

export function VerifyEmailForm({ token, next = '' }: { token: string; next?: string }) {
  const [state, action, pending] = useAuthAction(verifyEmailAction);
  return <form className="sign_form" action={action} aria-busy={pending}>
    <input type="hidden" name="token" value={token} /><input type="hidden" name="next" value={next} />
    <p>Confirm your email address, then sign in with your password.</p>
    <button className="sign_submit" disabled={pending}>{pending ? 'Verifying…' : 'Verify my email'}</button>
    <ActionFeedback state={state} />
  </form>;
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useAuthAction(resetPasswordAction);
  return <form className="sign_form" action={action} aria-busy={pending}>
    <input type="hidden" name="token" value={token} />
    <PasswordField id="new-password" label="New password" newPassword />
    <PasswordField id="confirm-password" name="confirmPassword" label="Confirm password" newPassword />
    <button className="sign_submit" disabled={pending}>{pending ? 'Saving…' : 'Reset password'}</button>
    <ActionFeedback state={state} />
    <div className="sign--up"><p><Link href="/forgot-password">Request a new reset link</Link></p></div>
  </form>;
}
