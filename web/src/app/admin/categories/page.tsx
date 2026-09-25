import { ActionForm } from '@/components/ui/ActionForm';
import { saveCategoryAction } from '@/actions/admin.actions';
import { query } from '@/lib/db';
import { imgSrc } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function CategoriesAdminPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const categories = await query<{ id: number; name: string; slug: string; image: string | null; is_active: number; products: number }[]>(
    `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS products FROM categories c ORDER BY c.name`
  );
  const editing = categories.find((category) => String(category.id) === id);
  return (
    <>
      <div className="page-head">
        <div>
          <h2>Categories</h2>
          <p>Group the storefront so products can be managed by category.</p>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head"><h3>{editing ? `Edit ${editing.name}` : 'New category'}</h3></div>
        <ActionForm className="admin-form" action={saveCategoryAction} success="Category saved.">
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          {editing?.image ? <input type="hidden" name="image" value={editing.image} /> : null}
          <div className="form-grid">
            <label>Name<input name="name" defaultValue={editing?.name || ''} required /></label>
            <label>Slug<input name="slug" defaultValue={editing?.slug || ''} placeholder="Auto from name" /></label>
          </div>
          <label>Status
            <select name="is_active" defaultValue={String(editing?.is_active ?? 1)}>
              <option value="1">Active</option>
              <option value="0">Hidden</option>
            </select>
          </label>
          <label>Image<input name="image_file" type="file" accept="image/*" /></label>
          <button type="submit">{editing ? 'Save category' : 'Add category'}</button>
        </ActionForm>
      </div>
      <div className="panel">
        <table className="admin-table">
          <thead><tr><th></th><th>Name</th><th>Slug</th><th>Products</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.image ? <img className="thumb" src={imgSrc(category.image)} alt="" /> : null}</td>
                <td>{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.products}</td>
                <td><span className={category.is_active ? 'pill' : 'pill off'}>{category.is_active ? 'Active' : 'Hidden'}</span></td>
                <td><a href={`?id=${category.id}`}>Edit</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
