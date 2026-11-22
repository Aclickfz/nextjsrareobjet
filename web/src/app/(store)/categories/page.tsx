import type { Metadata } from 'next';
import { CategoriesBanner } from '@/components/pages/CategoriesBanner';

export const metadata: Metadata = { title: 'Categories', description: 'Browse Rare Objet furniture categories.' };

export default function CategoriesPage() {
  return <CategoriesBanner />;
}
