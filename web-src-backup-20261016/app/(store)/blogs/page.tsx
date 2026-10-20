import type { Metadata } from 'next';
import { BlogsMain } from '@/components/pages/BlogsMain';
export const metadata: Metadata = { title: 'Blog', description: 'Stories and inspiration from JustAclick.' };
export default function BlogsPage() { return <BlogsMain />; }
