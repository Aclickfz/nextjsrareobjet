import { Badge } from '@/components/admin-ui/badge';
import { cn } from '@/lib/admin-cn';

const tones: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  confirmed: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  shipped: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  delivered: 'bg-green-600/10 text-green-600 dark:text-green-400',
  cancelled: 'bg-destructive/10 text-destructive'
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge className={cn('rounded-full border-0 capitalize', tones[status] ?? 'bg-muted text-muted-foreground', className)}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}
