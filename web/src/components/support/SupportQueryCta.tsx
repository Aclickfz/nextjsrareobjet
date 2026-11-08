'use client';

import { useState } from 'react';
import { SupportQueryDialog } from '@/components/support/SupportQueryDialog';

export function SupportQueryCta({
  mode,
  label
}: {
  mode: 'chat' | 'feedback';
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="site-content__cta" onClick={() => setOpen(true)}>
        {label}
      </button>
      <SupportQueryDialog mode={mode} open={open} onOpenChange={setOpen} />
    </>
  );
}
