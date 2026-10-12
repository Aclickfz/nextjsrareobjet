'use client';

import * as React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;

export function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return <SelectPrimitive.Trigger data-slot="select-trigger" className={cn('tw:flex tw:h-10 tw:w-full tw:items-center tw:justify-between tw:gap-2 tw:rounded-md tw:border tw:border-input tw:bg-background tw:px-3 tw:py-2 tw:text-sm tw:shadow-xs tw:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-ring tw:disabled:cursor-not-allowed tw:disabled:opacity-50', className)} {...props}>{children}<SelectPrimitive.Icon asChild><ChevronDownIcon className="tw:size-4 tw:opacity-50" /></SelectPrimitive.Icon></SelectPrimitive.Trigger>;
}

export function SelectContent({ className, children, position = 'popper', ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return <SelectPrimitive.Portal><SelectPrimitive.Content data-slot="select-content" data-admin-portal="" position={position} className={cn('tw:relative tw:z-50 tw:max-h-[min(var(--radix-select-content-available-height),320px)] tw:min-w-[var(--radix-select-trigger-width)] tw:overflow-hidden tw:rounded-md tw:border tw:border-border tw:bg-background tw:text-foreground tw:shadow-md', className)} {...props}>
    <SelectPrimitive.ScrollUpButton className="tw:flex tw:items-center tw:justify-center tw:py-1"><ChevronUpIcon className="tw:size-4" /></SelectPrimitive.ScrollUpButton>
    <SelectPrimitive.Viewport className="tw:p-1">{children}</SelectPrimitive.Viewport>
    <SelectPrimitive.ScrollDownButton className="tw:flex tw:items-center tw:justify-center tw:py-1"><ChevronDownIcon className="tw:size-4" /></SelectPrimitive.ScrollDownButton>
  </SelectPrimitive.Content></SelectPrimitive.Portal>;
}

export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return <SelectPrimitive.Item data-slot="select-item" className={cn('tw:relative tw:flex tw:w-full tw:items-center tw:rounded-sm tw:py-2 tw:pr-8 tw:pl-2 tw:text-sm tw:outline-none tw:focus:bg-accent tw:focus:text-accent-foreground tw:data-[disabled]:pointer-events-none tw:data-[disabled]:opacity-50', className)} {...props}><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText><span className="tw:absolute tw:right-2 tw:flex tw:size-4 tw:items-center tw:justify-center"><SelectPrimitive.ItemIndicator><CheckIcon className="tw:size-4" /></SelectPrimitive.ItemIndicator></span></SelectPrimitive.Item>;
}
