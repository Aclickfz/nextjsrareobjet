import * as React from 'react';
import { cn } from '@/lib/cn';

export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea data-slot="textarea" className={cn('tw:flex tw:min-h-24 tw:w-full tw:rounded-md tw:border tw:border-input tw:bg-background tw:px-3 tw:py-2 tw:text-sm tw:shadow-xs tw:placeholder:text-muted-foreground tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-ring tw:aria-invalid:border-destructive', className)} {...props} />;
}
