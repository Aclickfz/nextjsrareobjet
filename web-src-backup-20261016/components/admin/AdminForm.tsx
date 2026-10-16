'use client';

import { createContext, useContext, useRef, useState, useTransition, type ComponentProps, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { getURLFromRedirectError } from 'next/dist/client/components/redirect';
import { LoaderCircle, CircleAlert } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { AdminValidationError, type AdminActionResult } from '@/lib/admin-action-result';
import { validateAdminUpload, validateProductForm } from '@/lib/admin-validation';

type FormContext = { pending: boolean; fieldErrors: Record<string, string[]> };
const AdminFormContext = createContext<FormContext>({ pending: false, fieldErrors: {} });
export const useAdminForm = () => useContext(AdminFormContext);

type Props = Omit<ComponentProps<'form'>, 'action' | 'encType' | 'method'> & {
  action: (data: FormData) => Promise<void | AdminActionResult>;
  success?: string;
  successPath?: string;
  confirmMessage?: string;
  validation?: 'product';
};

export function AdminActionForm({ action, success = 'Changes saved.', successPath, confirmMessage, validation, children, ...props }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; tone: 'error' | 'success' }>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const busy = useRef(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const showError = (message: string, fields: Record<string, string[]> = {}) => {
    setFieldErrors(fields);
    setFeedback({ message, tone: 'error' });
    toast.error(message);
    requestAnimationFrame(() => feedbackRef.current?.focus());
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const data = new FormData(event.currentTarget);
    try {
      if (validation === 'product') validateProductForm(data);
      else validateAdminUpload(data);
    }
    catch (error) {
      if (error instanceof AdminValidationError) showError(error.message, error.fieldErrors);
      return;
    }
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    busy.current = true;
    setPending(true);
    setFeedback(undefined);
    setFieldErrors({});
    try {
      const result = await action(data);
      if (result?.error) { showError(result.error, result.fieldErrors); return; }
      toast.success(success);
      setFeedback({ message: success, tone: 'success' });
      if (successPath) router.push(successPath);
      router.refresh();
    } catch (error) {
      if (isRedirectError(error)) {
        const destination = getURLFromRedirectError(error);
        if (destination) { if (!successPath || destination === successPath) toast.success(success); router.push(destination); router.refresh(); }
      } else {
        showError('Unable to complete this action. Please try again. If you are uploading images, keep each below 5 MB and the combined upload below 9 MB.');
      }
    } finally { busy.current = false; setPending(false); }
  }
  return <AdminFormContext.Provider value={{ pending, fieldErrors }}>
    <form {...props} aria-busy={pending} onSubmit={submit} onInvalid={event => {
      const target = event.target as HTMLInputElement;
      if (target.name) setFieldErrors(current => ({ ...current, [target.name]: [target.validationMessage] }));
      setFeedback({ message: 'Please complete the required fields and check the highlighted values.', tone: 'error' });
    }}>
      <fieldset className="action-form-fields" disabled={pending}>{children}</fieldset>
      {feedback && <Alert ref={feedbackRef} tabIndex={-1} className="admin-feedback" role={feedback.tone === 'error' ? 'alert' : 'status'} data-tone={feedback.tone}>{feedback.tone === 'error' && <CircleAlert size={16} className="tw:mr-2 tw:inline-block" />}{feedback.message}</Alert>}
    </form>
  </AdminFormContext.Provider>;
}

export function AdminButton({ children, loadingText = 'Please wait…', disabled, type = 'button', ...props }: ComponentProps<typeof Button> & { loadingText?: string }) {
  const { pending } = useAdminForm();
  return <Button {...props} type={type} disabled={disabled || pending} aria-busy={type === 'submit' && pending}>
    {type === 'submit' && pending ? <><LoaderCircle className="tw:animate-spin" aria-hidden="true" />{loadingText}</> : children}
  </Button>;
}

export function AdminFilterForm({ children, ...props }: Omit<ComponentProps<'form'>, 'action' | 'onSubmit' | 'method'>) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <AdminFormContext.Provider value={{ pending, fieldErrors: {} }}><form {...props} method="get" onSubmit={event => {
    event.preventDefault();
    if (pending) return;
    const query = new URLSearchParams();
    for (const [name, value] of new FormData(event.currentTarget)) if (typeof value === 'string' && value) query.set(name, value);
    startTransition(() => router.push(`${window.location.pathname}?${query}`));
  }}>{children}</form></AdminFormContext.Provider>;
}

export function AdminToaster() { return <Toaster richColors closeButton position="top-right" />; }
export function AdminFieldError({ name, id }: { name?: string; id?: string }) {
  const { fieldErrors } = useAdminForm();
  return name && fieldErrors[name]?.length ? <span id={id} className="tw:text-xs tw:font-normal tw:text-destructive" role="alert">{fieldErrors[name].join(' ')}</span> : null;
}
