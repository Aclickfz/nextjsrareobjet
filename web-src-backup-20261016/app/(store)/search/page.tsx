import { redirect } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { listProducts } from '@/services/product.service';

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string; category?: string }> }) {
  const params = await searchParams;
  if (!params.q && !params.category) redirect('/products');
  let products: Awaited<ReturnType<typeof listProducts>>['products'] = [];
  let total = 0;
  try {
    const data = await listProducts({ q: params.q, sort: params.sort, category: params.category });
    products = data.products;
    total = data.pagination.total;
  } catch {
    products = [];
  }
  return <ProductGrid products={products} heading={params.q ? `${total} results for “${params.q}”` : 'Search'} sort={params.sort} q={params.q} category={params.category} action="/search" />;
}
