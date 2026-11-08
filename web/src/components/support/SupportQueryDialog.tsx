'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Headphones, MessageCircleMore, XIcon } from 'lucide-react';
import { submitSupportQuery } from '@/actions/support.actions';
import { useToast } from '@/components/ui/ToastProvider';

type Mode = 'chat' | 'feedback';

type Props = {
  mode: Mode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactNode;
};

const copy: Record<Mode, { title: string; description: string; messageLabel: string; submit: string; queryTypes: string[] }> = {
  chat: {
    title: 'Chat with Rare Objet',
    description: 'Send a quick query about products, orders, or delivery. We reply by email.',
    messageLabel: 'Your question',
    submit: 'Send query',
    queryTypes: ['Product advice', 'Order status', 'Shipping / delivery', 'Returns', 'Other']
  },
  feedback: {
    title: 'Share brand feedback',
    description: 'Tell us what worked, what could improve, or what you want to see next.',
    messageLabel: 'Your feedback',
    submit: 'Send feedback',
    queryTypes: ['Product quality', 'Website experience', 'Packaging', 'Delivery', 'Suggestion', 'Other']
  }
};

export function SupportQueryDialog({ mode, open = false, onOpenChange, trigger }: Props) {
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const labels = copy[mode];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange?.(false);
    };
    window.addEventListener('keydown', onKey);
    window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('input, textarea, button')?.focus(), 0);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onOpenChange]);

  const dialog = open && mounted ? createPortal(
    <div className="support-query-root" role="presentation">
      <button
        type="button"
        className="support-query-overlay"
        aria-label="Close dialog"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        ref={panelRef}
        className={`support-query-dialog support-query-dialog--${mode}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="support-query-header">
          <div className="support-query-brand">
            <span className="support-query-avatar" aria-hidden="true">
              {mode === 'chat' ? <MessageCircleMore size={22} /> : <Headphones size={22} />}
              <span className="support-query-avatar__status" />
            </span>
            <div className="support-query-heading">
              <p className="support-query-status">Online · usually replies in a few hours</p>
              <h2 id={titleId} className="support-query-title">{labels.title}</h2>
              <p id={descriptionId} className="support-query-description">{labels.description}</p>
            </div>
          </div>
          <button
            type="button"
            className="support-query-close"
            aria-label="Close"
            onClick={() => onOpenChange?.(false)}
          >
            <XIcon aria-hidden="true" />
          </button>
        </div>

        <form
          ref={formRef}
          className="support-query-form"
          onSubmit={async (event) => {
            event.preventDefault();
            if (pending) return;
            setPending(true);
            try {
              const result = await submitSupportQuery(new FormData(event.currentTarget));
              if (!result.ok) {
                toast(result.message, 'error');
                return;
              }
              toast(result.message);
              formRef.current?.reset();
              onOpenChange?.(false);
            } catch {
              toast('Could not send your message. Please try again shortly.', 'error');
            } finally {
              setPending(false);
            }
          }}
        >
          <div className="support-query-body">
            <input type="hidden" name="type" value={mode} />
            <div className="support-query-grid">
              <label className="support-query-field">
                <span>Name*</span>
                <input name="name" type="text" autoComplete="name" required maxLength={120} disabled={pending} />
              </label>
              <label className="support-query-field">
                <span>Email*</span>
                <input name="email" type="email" autoComplete="email" required maxLength={200} disabled={pending} />
              </label>
            </div>
            <div className="support-query-grid">
              <label className="support-query-field">
                <span>Phone</span>
                <input name="phone" type="tel" autoComplete="tel" maxLength={40} disabled={pending} />
              </label>
              <label className="support-query-field">
                <span>Query type*</span>
                <select name="queryType" required defaultValue="" disabled={pending}>
                  <option value="" disabled>Select query type</option>
                  {labels.queryTypes.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="support-query-field">
              <span>{labels.messageLabel}*</span>
              <textarea name="message" required minLength={10} maxLength={4000} rows={4} disabled={pending} />
            </label>
          </div>

          <div className="support-query-footer">
            <button
              type="button"
              className="support-query-cancel"
              disabled={pending}
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </button>
            <button type="submit" className="support-query-submit" disabled={pending}>
              {pending ? 'Sending…' : labels.submit}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      {trigger ? (
        <span
          onClick={() => onOpenChange?.(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onOpenChange?.(true);
            }
          }}
        >
          {trigger}
        </span>
      ) : null}
      {dialog}
    </>
  );
}
