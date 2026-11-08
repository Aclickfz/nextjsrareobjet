import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteContentPage } from '@/components/pages/SiteContentPage';
import { SupportQueryCta } from '@/components/support/SupportQueryCta';
import { getSitePage } from '@/lib/site-pages';

const page = getSitePage('brand-feedback');

export const metadata: Metadata = {
  title: page?.title ?? 'Page',
  description: page?.description ?? 'Rare Objet'
};

export default function ContentRoutePage() {
  if (!page) notFound();
  return (
    <SiteContentPage
      page={page}
      cta={<SupportQueryCta mode="feedback" label={page.cta?.label ?? 'Send feedback'} />}
    />
  );
}
