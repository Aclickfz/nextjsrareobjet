import * as React from 'react';
import { cn } from '@/lib/cn';

export function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return <input data-slot="input" type={type} className={cn('tw:flex tw:h-10 tw:w-full tw:min-w-0 tw:rounded-md tw:border tw:border-input tw:bg-background tw:px-3 tw:py-2 tw:text-sm tw:shadow-xs tw:transition-colors tw:placeholder:text-muted-foreground tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-ring tw:aria-invalid:border-destructive tw:file:border-0 tw:file:bg-transparent tw:file:text-sm tw:file:font-medium', className)} {...props} />;
}
