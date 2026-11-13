import Link from 'next/link';
import { AdminButton } from '@/components/admin/AdminForm';
import { AdminActionForm as ActionForm } from '@/components/admin/AdminForm';
import { ProductAdminFields, ProductAdminShell } from '@/components/admin/ProductAdminFields';
import { notFound } from 'next/navigation';
import { saveProductAction } from '@/actions/admin.actions';
import { query } from '@/lib/db';
import { adminCategories } from '@/repositories/catalog.repository';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query<Record<string, string | number | null>[]>('SELECT * FROM products WHERE id = :id', { id: Number(id) });
  const product = rows[0];
  if (!product) notFound();
  const categories = await adminCategories();
  const images = await query<{ id: number; path: string; is_primary: number; sort_order: number }[]>(
    'SELECT id, path, is_primary, sort_order FROM product_images WHERE product_id = :id ORDER BY is_primary DESC, sort_order ASC, id ASC',
    { id: Number(id) }
  );
  return (
    <ProductAdminShell
      title="Edit product"
      subtitle={String(product.name)}
      actions={
        <AdminButton asChild variant="outline">
          <Link href="/admin/products">Back</Link>
        </AdminButton>
      }
    >
      <ActionForm className="admin-form admin-form-crm" validation="product" action={saveProductAction} success="Product saved." successPath={`/admin/products/${id}`}>
        <ProductAdminFields product={product} categories={categories} images={images} />
        <div className="admin-form-actions">
          <AdminButton asChild variant="outline">
            <Link href="/admin/products">Cancel</Link>
          </AdminButton>
          <AdminButton type="submit">Save product</AdminButton>
        </div>
      </ActionForm>
    </ProductAdminShell>
  );
}
