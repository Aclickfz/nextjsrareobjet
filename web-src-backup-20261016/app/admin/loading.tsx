import { LoaderCircle } from 'lucide-react';

export default function AdminLoading() {
  return <div className="panel tw:p-6" role="status" aria-live="polite" aria-busy="true">
    <div className="tw:flex tw:items-center tw:gap-3"><LoaderCircle className="tw:size-5 tw:animate-spin" aria-hidden="true" /><span>Loading admin page…</span></div>
    <div className="tw:mt-6 tw:grid tw:gap-3" aria-hidden="true">{[1, 2, 3, 4].map(row => <div key={row} className="tw:h-10 tw:animate-pulse tw:rounded-md tw:bg-muted" />)}</div>
  </div>;
}
