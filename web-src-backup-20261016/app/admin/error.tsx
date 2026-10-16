'use client';

import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <Alert className="panel tw:p-6">
    <CircleAlert className="tw:mb-3 tw:size-6 tw:text-destructive" aria-hidden="true" />
    <h2 className="tw:text-lg tw:font-semibold">Unable to load this admin page</h2>
    <p className="tw:my-3 tw:text-muted-foreground">Please try again. If the problem continues, check the server connection.</p>
    <Button onClick={reset}>Try again</Button>
  </Alert>;
}
