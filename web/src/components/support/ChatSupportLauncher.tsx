'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { SupportQueryDialog } from '@/components/support/SupportQueryDialog';

function ChatBubblesIcon() {
  return (
    <svg className="chat-support-bubbles" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="22" fill="currentColor" className="chat-support-bubbles__disc" />
      <path
        className="chat-support-bubbles__mark"
        d="M28.8 17.2c0-3.2-3.1-5.8-7-5.8s-7 2.6-7 5.8c0 2.1 1.3 3.9 3.3 4.9l-.5 3.2 3.4-1.9c.5.1 1 .1 1.5.1 3.9 0 7-2.6 7-5.8z"
      />
      <path
        className="chat-support-bubbles__mark"
        d="M33.2 22.6c0-2.7-2.6-4.9-5.9-5.2.1.5.1 1 .1 1.5 0 3.9-3.5 7-7.8 7-.5 0-1-.1-1.5-.1.7 2.4 3.3 4.1 6.4 4.1.4 0 .8 0 1.2-.1l3 1.7-.4-2.8c1.8-.9 2.9-2.5 2.9-4.4z"
        opacity="0.92"
      />
    </svg>
  );
}

export function ChatSupportLauncher() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHint(true), 1800);
    const hide = window.setTimeout(() => setHint(false), 7800);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(hide);
    };
  }, []);

  return (
    <>
      <div className={`chat-support-dock${open ? ' is-open' : ''}${hint && !open ? ' show-hint' : ''}`}>
        {hint && !open ? (
          <div className="chat-support-hint" role="status">
            <span className="chat-support-hint__icon" aria-hidden="true">
              <ChatBubblesIcon />
            </span>
            <div className="chat-support-hint__copy">
              <strong>Need help?</strong>
              <span>Chat with our support team</span>
            </div>
            <button
              type="button"
              className="chat-support-hint__dismiss"
              aria-label="Dismiss chat tip"
              onClick={() => setHint(false)}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <button
          type="button"
          className="chat-support-launcher"
          aria-label={open ? 'Close chat support' : 'Open chat support'}
          aria-expanded={open}
          onClick={() => {
            setHint(false);
            setOpen((value) => !value);
          }}
        >
          <span className="chat-support-launcher__pulse" aria-hidden="true" />
          <span className="chat-support-launcher__face" aria-hidden="true">
            {open ? <X size={28} strokeWidth={2.4} /> : <ChatBubblesIcon />}
          </span>
        </button>
      </div>

      <SupportQueryDialog mode="chat" open={open} onOpenChange={setOpen} />
    </>
  );
}
