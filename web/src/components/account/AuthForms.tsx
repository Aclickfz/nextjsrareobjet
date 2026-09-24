'use client';

import { useActionState } from 'react';
import { loginAction, registerAction } from '@/actions/auth.actions';

export function LoginForm({ next = '' }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form className="sign_form" action={action}>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div className="sign_input">
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      </div>
      <div className="sign_input">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Enter your password" required />
      </div>
      <button className="sign_submit" type="submit" disabled={pending}>Sign in</button>
      {state?.error ? <p className="ui-status" role="status">{state.error}</p> : null}
    </form>
  );
}

export function RegisterForm({ next = '' }: { next?: string }) {
  const [state, action, pending] = useActionState(registerAction, undefined);
  return (
    <form className="sign_form" action={action}>
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
      <div className="sign_input">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" placeholder="Create a password" required />
      </div>
      <button className="sign_submit" type="submit" disabled={pending}>Create account</button>
      {state?.error ? <p className="ui-status" role="status">{state.error}</p> : null}
    </form>
  );
}
