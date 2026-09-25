'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type Tone = 'success' | 'error' | 'info';
type Toast = { id: number; message: string; tone: Tone };
const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const sequence = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const dismiss = useCallback((id: number) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setItems(items => items.filter(item => item.id !== id));
  }, []);
  const show = useCallback((message: string, tone: Tone = 'success') => {
    if (!message) return;
    const id = ++sequence.current;
    setItems(items => [...items.slice(-3), { id, message, tone }]);
    timers.current.set(id, setTimeout(() => dismiss(id), tone === 'error' ? 12000 : 7000));
  }, [dismiss]);
  useEffect(() => {
    const activeTimers = timers.current;
    // Static forms and legacy scripts share the same notification surface.
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<{ message: string; tone?: Tone }>).detail;
      if (detail?.message) show(detail.message, detail.tone || 'info');
    };
    const onInvalid = (event: Event) => {
      const field = event.target as HTMLInputElement;
      if (field.form?.querySelector(':invalid') === field) show(field.validationMessage, 'error');
    };
    const onStaticSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement;
      if (form.dataset.staticForm) {
        event.preventDefault();
        event.stopImmediatePropagation();
        show(form.dataset.staticForm, 'info');
      }
    };
    window.addEventListener('site:toast', onToast);
    document.addEventListener('invalid', onInvalid, true);
    document.addEventListener('submit', onStaticSubmit, true);
    return () => {
      window.removeEventListener('site:toast', onToast);
      document.removeEventListener('invalid', onInvalid, true);
      document.removeEventListener('submit', onStaticSubmit, true);
      activeTimers.forEach(timer => clearTimeout(timer));
    };
  }, [show]);
  return <ToastContext.Provider value={show}>
    {children}
    <div className="toast-stack" aria-label="Notifications">
      {items.map(item => <div key={item.id} className={`site-toast site-toast--${item.tone}`} role={item.tone === 'error' ? 'alert' : 'status'}>
        <span className="toast-icon" aria-hidden="true">{item.tone === 'success' ? '✓' : item.tone === 'error' ? '!' : 'i'}</span>
        <div><strong>{item.tone === 'success' ? 'All set' : item.tone === 'error' ? 'Please check' : 'Just a moment'}</strong><p>{item.message}</p></div>
        <button type="button" onClick={() => dismiss(item.id)} aria-label="Dismiss notification">×</button>
      </div>)}
    </div>
  </ToastContext.Provider>;
}

export function ActionFeedback({ state }: { state?: { error?: string; message?: string } }) {
  const toast = useToast();
  useEffect(() => {
    if (state?.error) toast(state.error, 'error');
    else if (state?.message) toast(state.message, 'success');
  }, [state, toast]);
  // Keep instructions available after a toast is dismissed.
  return state?.error || state?.message ? <p className={`action-feedback ${state.error ? 'action-feedback--error' : ''}`}>{state.error || state.message}</p> : null;
}

export function NoticeToast({ message }: { message: string }) {
  const toast = useToast();
  const shown = useRef('');
  useEffect(() => {
    if (message && shown.current !== message) { shown.current = message; toast(message); }
  }, [message, toast]);
  return message ? <p className="action-feedback">{message}</p> : null;
}
