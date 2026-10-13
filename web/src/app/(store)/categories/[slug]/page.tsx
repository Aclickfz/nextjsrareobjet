import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { navigationCategories, getCategory } from '@/repositories/catalog.repository';
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

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ sort?: string; min?: string; max?: string; stock?: string }> }) {
  const { slug } = await params;
  const query = await searchParams;
  let category = null;
  let products: Awaited<ReturnType<typeof listProducts>>['products'] = [];
  let total = 0;
  try {
    category = await getCategory(slug);
    if (category) {
      const data = await listProducts({
        category: slug,
        sort: query.sort,
        min: query.min ? Number(query.min) : undefined,
        max: query.max ? Number(query.max) : undefined,
        inStock: query.stock === '1',
        limit: 48
      });
      products = data.products;
      total = data.pagination.total;
    }
  } catch {
    category = null;
  }
  if (!category) notFound();
  const children = (await navigationCategories()).filter(c => c.parent_id === category.id);
  return (
    <>
    {children.length > 0 && <nav aria-label="Subcategories" style={{ display: 'flex', flexWrap: 'wrap', gap: 20, padding: 24 }}>{children.map(c => <a key={c.id} href={`/categories/${c.slug}`}>{c.name}</a>)}</nav>}
    <ProductGrid
      products={products}
      heading={category.name}
      sort={query.sort || 'featured'}
      category={slug}
      action={`/categories/${slug}`}
      total={total}
      min={query.min}
      max={query.max}
      inStock={query.stock === '1'}
    />
    </>
  );
}
