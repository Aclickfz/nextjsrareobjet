'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/admin-ui/breadcrumb';
import { Separator } from '@/components/admin-ui/separator';
import { SidebarTrigger } from '@/components/admin-ui/sidebar';
import { ModeToggle } from './ModeToggle';
import { ProfileDropdown } from './ProfileDropdown';

const labelFor = (segment: string, previous?: string) => {
  if (/^\d+$/.test(segment)) return previous === 'orders' ? `Order #${segment}` : `#${segment}`;
  if (segment === 'reports') return 'Sales';
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export function AdminHeader({ user }: { user: { name: string; email: string } }) {
  const segments = usePathname().split('/').filter(Boolean);

  return (
    <header className="bg-card sticky top-0 z-40 border-b">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <SidebarTrigger className="[&_svg]:size-5!" />
          <Separator orientation="vertical" className="hidden h-4! sm:block" />
          <Breadcrumb className="hidden min-w-0 sm:block">
            <BreadcrumbList>
              {segments.map((segment, index) => {
                const isLast = index === segments.length - 1;
                const href = '/' + segments.slice(0, index + 1).join('/');
                const label = labelFor(segment, segments[index - 1]);
                return (
                  <Fragment key={href}>
                    <BreadcrumbItem>
                      {isLast ? <BreadcrumbPage>{label}</BreadcrumbPage> : <BreadcrumbLink asChild><Link href={href}>{label}</Link></BreadcrumbLink>}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-1.5">
          <ModeToggle />
          <ProfileDropdown name={user.name} email={user.email} />
        </div>
      </div>
    </header>
  );
}
