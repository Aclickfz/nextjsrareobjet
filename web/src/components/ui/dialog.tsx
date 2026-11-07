'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export function DialogOverlay({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return <DialogPrimitive.Overlay data-slot="dialog-overlay" className={cn('tw:fixed tw:inset-0 tw:z-50 tw:bg-black/50 tw:data-[state=open]:animate-in tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=open]:fade-in-0', className)} {...props} />;
}

export function DialogContent({
  className,
  overlayClassName,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & { overlayClassName?: string; showCloseButton?: boolean }) {
  return <DialogPortal data-slot="dialog-portal">
    <DialogOverlay className={overlayClassName} />
    <DialogPrimitive.Content data-slot="dialog-content" className={cn('tw:fixed tw:top-1/2 tw:left-1/2 tw:z-50 tw:grid tw:w-full tw:max-w-[calc(100%-2rem)] tw:-translate-x-1/2 tw:-translate-y-1/2 tw:gap-4 tw:rounded-lg tw:border tw:bg-background tw:p-6 tw:shadow-lg tw:duration-200 tw:sm:max-w-lg tw:data-[state=open]:animate-in tw:data-[state=closed]:animate-out tw:data-[state=closed]:fade-out-0 tw:data-[state=open]:fade-in-0 tw:data-[state=closed]:zoom-out-95 tw:data-[state=open]:zoom-in-95', className)} {...props}>
      {children}
      {showCloseButton ? <DialogPrimitive.Close data-slot="dialog-close" className="tw:absolute tw:top-4 tw:right-4 tw:rounded-xs tw:opacity-70 tw:transition-opacity tw:hover:opacity-100 tw:focus:outline-hidden tw:focus:ring-2 tw:focus:ring-ring tw:disabled:pointer-events-none">
        <XIcon className="tw:size-4" />
        <span className="tw:sr-only">Close</span>
      </DialogPrimitive.Close> : null}
    </DialogPrimitive.Content>
  </DialogPortal>;
}

export function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn('tw:flex tw:flex-col tw:gap-2 tw:text-center tw:sm:text-left', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-footer" className={cn('tw:flex tw:flex-col-reverse tw:gap-2 tw:sm:flex-row tw:sm:justify-end', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn('tw:text-lg tw:leading-none tw:font-semibold', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn('tw:text-sm tw:text-muted-foreground', className)} {...props} />;
}
