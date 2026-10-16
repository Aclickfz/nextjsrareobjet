import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/components/admin-ui/card';
import { cn } from '@/lib/admin-cn';

export function StatCard({ icon, title, value, hint, className }: { icon: ReactNode; title: string; value: ReactNode; hint?: ReactNode; className?: string }) {
  return (
    <Card className={cn('gap-4', className)}>
      <CardHeader className="flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm [&_svg]:size-4">{icon}</div>
        <span className="text-2xl font-semibold">{value}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <span className="text-base font-semibold">{title}</span>
        {hint && <p className="text-muted-foreground text-sm">{hint}</p>}
      </CardContent>
    </Card>
  );
}
