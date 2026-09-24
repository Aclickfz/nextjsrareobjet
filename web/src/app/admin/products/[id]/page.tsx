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
  return (
    <>
      <div className="page-head"><div><h2>Edit product</h2><p>{String(product.name)}</p></div></div>
      <div className="panel">
      <form className="admin-form" action={saveProductAction} encType="multipart/form-data">
        <input type="hidden" name="id" value={String(product.id)} />
        <div className="form-grid">
          <label>Name<input name="name" defaultValue={String(product.name)} required /></label>
          <label>Slug<input name="slug" defaultValue={String(product.slug)} /></label>
        </div>
        <label>Category
          <select name="category_id" defaultValue={String(product.category_id || '')}>
            <option value="">Uncategorized</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>
        <div className="form-grid">
          <label>Price<input name="price" type="number" step="0.01" defaultValue={Number(product.price)} required /></label>
          <label>Compare at<input name="compare_at_price" type="number" step="0.01" defaultValue={product.compare_at_price ? Number(product.compare_at_price) : ''} /></label>
          <label>Stock<input name="stock_qty" type="number" defaultValue={Number(product.stock_qty)} /></label>
          <label>SKU<input name="sku" defaultValue={String(product.sku || '')} /></label>
          <label>Badge<input name="badge" defaultValue={String(product.badge || '')} /></label>
          <label>Grade<input name="grade_label" defaultValue={String(product.grade_label || '')} /></label>
        </div>
        <label>Description<textarea name="description" rows={4} defaultValue={String(product.description || '')} /></label>
        <label>Storefront
          <select name="is_active" defaultValue={String(product.is_active)}>
            <option value="1">Live</option>
            <option value="0">Hidden</option>
          </select>
        </label>
        <label>Replace image<input name="image" type="file" accept="image/*" /></label>
        <button type="submit">Save product</button>
      </form>
      </div>
    </>
  );
}
