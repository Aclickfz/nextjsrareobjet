import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteContentPage } from '@/components/pages/SiteContentPage';
import { getSitePage } from '@/lib/site-pages';

const page = getSitePage('design-consultation');

export const metadata: Metadata = {
  title: page?.title ?? 'Page',
  description: page?.description ?? 'Rare Objet'
};

export default function ContentRoutePage() {
  if (!page) notFound();
  return <SiteContentPage page={page} />;
}
