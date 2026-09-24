import type { Metadata } from 'next';
import { AboutMain } from '@/components/pages/AboutMain';
export const metadata: Metadata = { title: 'About us', description: 'The JustAclick story.' };
export default function AboutPage() { return <AboutMain />; }
