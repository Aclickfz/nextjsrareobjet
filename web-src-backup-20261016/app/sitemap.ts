import type { MetadataRoute } from 'next';
import { listCategories, listProducts } from '@/services/product.service';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const staticPages = ['', '/products', '/categories', '/about', '/contact', '/blogs', '/blogs/story'].map((path) => ({
    url: `${base}${path || '/'}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.7
  }));
  let extra: MetadataRoute.Sitemap = [];
  try {
    const categories = await listCategories();
    const products = await listProducts({ limit: 48 });
    extra = [
      ...categories.map((category) => ({ url: `${base}/categories/${category.slug}`, changeFrequency: 'weekly' as const, priority: 0.6 })),
      ...products.products.map((product) => ({ url: `${base}/products/${product.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 }))
    ];
  } catch {
    extra = [];
  }
  return [...staticPages, ...extra];
}
