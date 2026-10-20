'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:whitespace-nowrap tw:rounded-md tw:text-sm tw:font-medium tw:transition-colors tw:disabled:pointer-events-none tw:disabled:opacity-50 tw:[&_svg]:pointer-events-none tw:[&_svg]:size-4 tw:shrink-0 tw:outline-none tw:focus-visible:ring-2 tw:focus-visible:ring-ring tw:aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default: 'tw:bg-primary tw:text-primary-foreground tw:hover:bg-primary/90',
        destructive: 'tw:bg-destructive tw:text-white tw:hover:bg-destructive/90',
        outline: 'tw:border tw:border-input tw:bg-background tw:hover:bg-accent tw:hover:text-accent-foreground',
        secondary: 'tw:bg-secondary tw:text-secondary-foreground tw:hover:bg-secondary/80',
        ghost: 'tw:hover:bg-accent tw:hover:text-accent-foreground',
        link: 'tw:text-primary tw:underline-offset-4 tw:hover:underline'
      },
      size: { default: 'tw:h-10 tw:px-4 tw:py-2', sm: 'tw:h-8 tw:px-3', lg: 'tw:h-11 tw:px-6', icon: 'tw:size-10' }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
);

function Button({ className, variant = 'default', size, asChild = false, type = 'button', ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'button';
  return <Comp data-slot="button" data-variant={variant} className={cn(buttonVariants({ variant, size, className }))} {...(!asChild ? { type } : {})} {...props} />;
}
export { Button, buttonVariants };
