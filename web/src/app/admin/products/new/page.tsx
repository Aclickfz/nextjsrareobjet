import { ActionForm } from '@/components/ui/ActionForm';
import { saveProductAction } from '@/actions/admin.actions';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const categories = await query<{ id: number; name: string }[]>('SELECT id, name FROM categories ORDER BY name');
  return (
    <>
      <div className="page-head"><div><h2>Add product</h2><p>Upload a photo and place the item in a category.</p></div></div>
      <div className="panel">
      <ActionForm className="admin-form" action={saveProductAction} success="Product saved." successPath="/admin/products">
        <div className="form-grid">
          <label>Name<input name="name" required /></label>
          <label>Slug<input name="slug" placeholder="Auto from name" /></label>
        </div>
        <label>Category
          <select name="category_id" required>
            <option value="">Select a category</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </label>
        <div className="form-grid">
          <label>Price<input name="price" type="number" step="0.01" required /></label>
          <label>Compare at<input name="compare_at_price" type="number" step="0.01" /></label>
          <label>Stock<input name="stock_qty" type="number" defaultValue={0} /></label>
          <label>SKU<input name="sku" /></label>
          <label>Badge<input name="badge" placeholder="New, Sale" /></label>
          <label>Grade<input name="grade_label" /></label>
        </div>
        <label>Description<textarea name="description" rows={4} /></label>
        <label>Product image<input name="image" type="file" accept="image/*" /></label>
        <button type="submit">Save product</button>
      </ActionForm>
      </div>
    </>
  );
}
