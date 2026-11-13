import * as React from 'react';
import { cn } from '@/lib/cn';

export function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        'tw:flex tw:w-full tw:min-w-0 tw:rounded-md tw:border tw:border-input tw:bg-background tw:text-sm tw:shadow-xs tw:transition-colors tw:placeholder:text-muted-foreground tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:focus-visible:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-ring tw:aria-invalid:border-destructive',
        type === 'file'
          ? 'tw:h-auto tw:min-h-10 tw:cursor-pointer tw:px-3 tw:py-2 tw:file:mr-3 tw:file:rounded-md tw:file:border tw:file:border-input tw:file:bg-muted tw:file:px-3 tw:file:py-1.5 tw:file:text-sm tw:file:font-medium tw:file:text-foreground'
          : 'tw:h-10 tw:px-3 tw:py-2 tw:file:border-0 tw:file:bg-transparent tw:file:text-sm tw:file:font-medium',
        className
      )}
      {...props}
    />
  );
}
