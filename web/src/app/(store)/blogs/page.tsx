import type { Metadata } from 'next';
import { BlogsMain } from '@/components/pages/BlogsMain';
export const metadata: Metadata = { title: 'Blog', description: 'Stories and inspiration from Rare Objet.' };
export default function BlogsPage() { return <BlogsMain />; }
