import { ActionForm } from '@/components/ui/ActionForm';
import { ProductAdminFields, ProductAdminShell } from '@/components/admin/ProductAdminFields';
import { notFound } from 'next/navigation';
import { saveProductAction } from '@/actions/admin.actions';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await query<Record<string, string | number | null>[]>('SELECT * FROM products WHERE id = :id', { id: Number(id) });
  const product = rows[0];
  if (!product) notFound();
  const categories = await query<{ id: number; name: string }[]>('SELECT id, name FROM categories ORDER BY name');
  const images = await query<{ id: number; path: string; is_primary: number }[]>(
    'SELECT id, path, is_primary FROM product_images WHERE product_id = :id ORDER BY is_primary DESC, sort_order ASC',
    { id: Number(id) }
  );
  return (
    <ProductAdminShell title="Edit product" subtitle={String(product.name)}>
      <ActionForm className="admin-form" action={saveProductAction} success="Product saved." successPath="/admin/products">
        <ProductAdminFields product={product} categories={categories} images={images} />
        <button type="submit">Save product</button>
      </ActionForm>
    </ProductAdminShell>
  );
}
