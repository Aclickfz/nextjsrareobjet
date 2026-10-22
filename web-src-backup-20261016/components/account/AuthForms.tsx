'use client';

import { useAuthAction } from './useAuthAction';
import Link from 'next/link';
import { PasswordField } from './PasswordField';
import { ActionFeedback } from '@/components/ui/ToastProvider';
import { loginAction, registerAction } from '@/actions/auth.actions';

export function LoginForm({ next = '' }: { next?: string }) {
  const [state, action, pending] = useAuthAction(loginAction, 'Welcome back. You are signed in.');
  return (
    <form className="sign_form" action={action} aria-busy={pending}>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div className="sign_input">
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      </div>
      <PasswordField />
      <div className="auth-helper"><Link href="/forgot-password">Forgot password?</Link></div>
      <button className="sign_submit" type="submit" disabled={pending}>{pending ? <><span className="auth-spinner" aria-hidden="true" /> Signing in...</> : <>Sign in <span aria-hidden="true">↗</span></>}</button>

      <ActionFeedback state={state} />
    </form>
  );
}

export function RegisterForm({ next = '' }: { next?: string }) {
  const [state, action, pending] = useAuthAction(registerAction);
  return (
    <form className="sign_form" action={action} aria-busy={pending}>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div className="sign_input">
        <label htmlFor="name">Full name</label>
        <input id="name" name="name" type="text" autoComplete="name" placeholder="Your full name" required />
      </div>
      <div className="sign_input">
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      </div>
      <div className="sign_input">
        <label htmlFor="phone">Phone number</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Your phone number" required />
      </div>
      <PasswordField newPassword />
      <p className="auth-hint">We’ll email you a verification link to activate your account.</p>
      <button className="sign_submit" type="submit" disabled={pending}>{pending ? <><span className="auth-spinner" aria-hidden="true" /> Creating account...</> : <>Create account <span aria-hidden="true">↗</span></>}</button>
      <ActionFeedback state={state} />
    </form>
  );
}
