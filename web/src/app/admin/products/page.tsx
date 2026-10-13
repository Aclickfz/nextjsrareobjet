import { AdminInput, AdminSelect } from '@/components/admin/AdminControls';
import { AdminButton, AdminFilterForm } from '@/components/admin/AdminForm';
import { AdminActionForm as ActionForm } from '@/components/admin/AdminForm';
import Link from 'next/link';
import { adminCategories } from '@/repositories/catalog.repository';
import { categoryPath } from '@/lib/catalog-tree';
import { query } from '@/lib/db';
import { imgSrc, money } from '@/lib/utils';
import { deactivateProductAction, deleteProductAction } from '@/actions/admin.actions';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q, category } = await searchParams;
  const params: Record<string, unknown> = {};
  const filters = ['1=1'];
  if (q) {
    filters.push('(p.name LIKE :q OR p.sku LIKE :q)');
    params.q = `%${q}%`;
  }
  if (category) {
    filters.push('(p.category_id = :category OR c.parent_id = :category OR parent.parent_id = :category OR grandparent.parent_id = :category)');
    params.category = Number(category);
  }
  const categories = await adminCategories();
  const products = await query<{ id: number; name: string; sku: string | null; price: number; stock_qty: number; is_active: number; category_name: string | null; image: string | null }[]>(
    `SELECT p.id, p.name, p.sku, p.price, p.stock_qty, p.is_active, c.name AS category_name,
      (SELECT path FROM product_images pi WHERE pi.product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) AS image
     FROM products p LEFT JOIN categories c ON c.id = p.category_id LEFT JOIN categories parent ON parent.id = c.parent_id LEFT JOIN categories grandparent ON grandparent.id = parent.parent_id
     WHERE ${filters.join(' AND ')} ORDER BY p.sort_order ASC, p.id ASC LIMIT 100`,
    params
  );
  return (
    <>
      <div className="page-head">
        <div>
          <h2>Products</h2>
          <p>Create, edit, and hide catalog items by category.</p>
        </div>
        <AdminButton asChild><Link className="tw:text-white" href="/admin/products/new">Add product</Link></AdminButton>
      </div>
      <AdminFilterForm className="filters" key={`${q || ''}-${category || ''}`}>
        <AdminInput type="search" name="q" aria-label="Search products" defaultValue={q || ''} placeholder="Search name or SKU" />
        <AdminSelect name="category" aria-label="Filter by category" defaultValue={category || ''}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{categoryPath(categories, item.id).map(c => c.name).join(" / ")}</option>)}
        </AdminSelect>
        <AdminButton type="submit">Filter</AdminButton>
      </AdminFilterForm>
      <div className="panel">
        <table className="admin-table">
          <thead><tr><th></th><th>Product</th><th>SKU</th><th>Price</th><th>Stock</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.image ? <img className="thumb" src={imgSrc(product.image)} alt="" /> : <span className="thumb" />}</td>
                <td>{product.name}<div className="muted">{product.category_name || 'Uncategorized'}</div></td>
                <td>{product.sku || '—'}</td>
                <td>{money(Number(product.price))}</td>
                <td>{product.stock_qty}</td>
                <td><span className={product.is_active ? 'pill' : 'pill off'}>{product.is_active ? 'Live' : 'Hidden'}</span></td>
                <td>
                  <div className="row-actions">
                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                    <ActionForm action={deleteProductAction} success="Product deleted." confirmMessage={`Delete "${product.name}" permanently? This cannot be undone.`}>
                      <AdminInput type="hidden" name="id" value={product.id} />
                      <AdminButton variant="destructive" size="sm" type="submit">Delete</AdminButton>
                    </ActionForm>
                    {product.is_active ? (
                      <ActionForm action={deactivateProductAction} success="Product hidden."><AdminInput type="hidden" name="id" value={product.id} /><AdminButton variant="destructive" size="sm" type="submit">Hide</AdminButton></ActionForm>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
