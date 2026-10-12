import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function Alert({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="alert" role="alert" className={cn('tw:relative tw:w-full tw:rounded-lg tw:border tw:border-border tw:p-4 tw:text-sm', className)} {...props} />;
}
