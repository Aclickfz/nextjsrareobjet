'use client';

import { useRef, useState, type ComponentProps } from 'react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { getURLFromRedirectError } from 'next/dist/client/components/redirect';
import { useToast } from './ToastProvider';

type Props = Omit<ComponentProps<'form'>, 'action'> & { action: (data: FormData) => Promise<void>; success?: string; successPath?: string };
export function ActionForm({ action, success = 'Changes saved.', successPath, children, ...props }: Props) {
  const toast = useToast();
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  return <form {...props} aria-busy={pending} action={async data => {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    try { await action(data); toast(success); }
    catch (error) {
      if (isRedirectError(error)) {
        if (successPath && getURLFromRedirectError(error) === successPath) toast(success);
        throw error;
      }
      toast('Unable to complete this action. Check your details and try again.', 'error');
    } finally { busy.current = false; setPending(false); }
  }}><fieldset className="action-form-fields" disabled={pending}>{children}</fieldset></form>;
}
