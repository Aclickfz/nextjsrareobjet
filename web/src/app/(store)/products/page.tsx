import type { Metadata } from 'next';
import { ProductGrid } from '@/components/product/ProductGrid';
import { listProducts } from '@/services/product.service';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Shop', description: 'Browse JustAclick furniture and home decor.' };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string; category?: string; page?: string }> }) {
  const params = await searchParams;
  let products: Awaited<ReturnType<typeof listProducts>>['products'] = [];
  let total = 0;
  let dbError = false;
  try {
    const data = await listProducts({
      q: params.q,
      sort: params.sort,
      category: params.category,
      page: Number(params.page || 1)
    });
    products = data.products;
    total = data.pagination.total;
  } catch {
    dbError = true;
    products = [];
  }
  const heading = params.q ? `${total} results for “${params.q}”` : 'Shop';
  return (
    <>
      {dbError ? <p className="ui-status" role="status">Products could not be loaded. Check the database settings on the server.</p> : null}
      <ProductGrid products={products} heading={heading} sort={params.sort} q={params.q} category={params.category} />
    </>
  );
}
