'use client';

import { useState } from 'react';

export function PasswordField({ id = 'password', name = 'password', label = 'Password', newPassword = false }: { id?: string; name?: string; label?: string; newPassword?: boolean }) {
  const [visible, setVisible] = useState(false);
  return <div className="sign_input">
    <label htmlFor={id}>{label}</label>
    <div className="auth-password">
      <input id={id} name={name} type={visible ? 'text' : 'password'} autoComplete={newPassword ? 'new-password' : 'current-password'} minLength={newPassword ? 8 : undefined} maxLength={72} placeholder={newPassword ? 'At least 8 characters' : 'Enter your password'} required />
      <button type="button" aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={visible} onClick={() => setVisible(value => !value)}>{visible ? 'Hide' : 'Show'}</button>
    </div>
  </div>;
}
