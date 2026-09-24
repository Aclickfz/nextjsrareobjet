import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { getCategory } from '@/repositories/catalog.repository';
import { listProducts } from '@/services/product.service';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategory(slug);
    if (!category) return { title: 'Category' };
    return {
      title: category.name,
      description: `Shop ${category.name} at JustAclick.`,
      alternates: { canonical: `/categories/${category.slug}` },
      openGraph: { title: category.name, description: `Shop ${category.name} at JustAclick.`, images: category.image ? [`/${category.image.replace(/^\//, '')}`] : undefined }
    };
  } catch {
    return { title: 'Category' };
  }
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ sort?: string }> }) {
  const { slug } = await params;
  const query = await searchParams;
  let category = null;
  let products: Awaited<ReturnType<typeof listProducts>>['products'] = [];
  try {
    category = await getCategory(slug);
    if (category) products = (await listProducts({ category: slug, sort: query.sort })).products;
  } catch {
    category = null;
  }
  if (!category) notFound();
  return <ProductGrid products={products} heading={category.name} sort={query.sort} category={slug} action={`/categories/${slug}`} />;
}
