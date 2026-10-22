import type { Metadata } from 'next';
import { BlogStoryMain } from '@/components/pages/BlogStoryMain';
export const metadata: Metadata = { title: 'Blog story', description: 'A JustAclick story.' };
export default function BlogStoryPage() { return <BlogStoryMain />; }
