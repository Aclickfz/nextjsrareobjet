'use client';

import * as React from 'react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return <CheckboxPrimitive.Root data-slot="checkbox" className={cn('tw:peer tw:size-4 tw:shrink-0 tw:rounded-sm tw:border tw:border-input tw:shadow-xs tw:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-ring tw:disabled:cursor-not-allowed tw:disabled:opacity-50 tw:data-[state=checked]:bg-primary tw:data-[state=checked]:text-primary-foreground', className)} {...props}>
    <CheckboxPrimitive.Indicator className="tw:flex tw:items-center tw:justify-center"><CheckIcon className="tw:size-3.5" /></CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>;
}
