import Link from 'next/link';
import { AdminInput, AdminSelect } from '@/components/admin/AdminControls';
import { CategoryParentCombobox } from '@/components/admin/CategoryParentCombobox';
import { AdminButton } from '@/components/admin/AdminForm';
import { AdminActionForm as ActionForm } from '@/components/admin/AdminForm';
import { saveCategoryAction, deleteCategoryAction } from '@/actions/admin.actions';
import { adminCategories, STORE_NAV } from '@/repositories/catalog.repository';
import { categoryPath } from '@/lib/catalog-tree';

export const dynamic = 'force-dynamic';

export default async function CategoriesAdminPage({ searchParams }: { searchParams: Promise<{ id?: string; parent?: string }> }) {
  const { id, parent } = await searchParams;
  const categories = await adminCategories();
  const fixed = (slug: string) => STORE_NAV.some((root) => root.slug === slug);
  const editing = categories.find((c) => String(c.id) === id && !fixed(c.slug));
  const parents = categories.filter(
    (c) =>
      categoryPath(categories, c.id).length <= 3 &&
      fixed(categoryPath(categories, c.id)[0]?.slug) &&
      !categoryPath(categories, c.id).some((p) => p.id === editing?.id)
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Categories</h2>
          <p>Top navigation stays fixed. Lower sort numbers appear first.</p>
        </div>
        <div className="page-head-actions">
          <AdminButton asChild variant="outline">
            <Link href="/admin/categories">New category</Link>
          </AdminButton>
        </div>
      </div>

      <div className="panel panel-form">
        <div className="panel-head">
          <h3>{editing ? `Edit ${editing.name}` : 'New category / subcategory'}</h3>
        </div>
        <ActionForm key={editing?.id || `new-${parent || ''}`} className="admin-form admin-form-wide" action={saveCategoryAction} success="Category saved.">
          <AdminInput type="hidden" name="id" value={editing?.id || 0} />
          <label>
            Parent category
            <CategoryParentCombobox
              options={parents.map((category) => ({
                id: category.id,
                label: categoryPath(categories, category.id)
                  .map((item) => item.name)
                  .join(' / ')
              }))}
              defaultValue={String(editing?.parent_id || (parents.some((category) => String(category.id) === parent) ? parent : ''))}
            />
          </label>
          <div className="form-grid">
            <label>
              Name
              <AdminInput name="name" maxLength={200} defaultValue={editing?.name || ''} required />
            </label>
            <label>
              Slug
              <AdminInput name="slug" maxLength={200} defaultValue={editing?.slug || ''} placeholder="Auto from name" />
            </label>
            <label>
              Sort order
              <AdminInput type="number" name="sort_order" min="0" step="1" defaultValue={editing?.sort_order || 0} />
            </label>
            <label>
              Status
              <AdminSelect name="is_active" defaultValue={editing?.is_active ?? 1}>
                <option value="1">Active</option>
                <option value="0">Hidden (including descendants)</option>
              </AdminSelect>
            </label>
          </div>
          <label>
            Image
            <AdminInput type="file" name="image_file" accept="image/*" />
          </label>
          <div className="admin-form-actions">
            {editing ? (
              <AdminButton asChild variant="outline">
                <Link href="/admin/categories">Cancel</Link>
              </AdminButton>
            ) : null}
            <AdminButton type="submit">{editing ? 'Save changes' : 'Create category'}</AdminButton>
          </div>
        </ActionForm>
      </div>

      <div className="panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category path</th>
              <th>Slug</th>
              <th>Order</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>
                  {categoryPath(categories, c.id)
                    .map((p) => p.name)
                    .join(' / ')}
                </td>
                <td>{c.slug}</td>
                <td>{c.sort_order}</td>
                <td>
                  <span className={c.is_active ? 'pill' : 'pill off'}>{c.is_active ? 'Active' : 'Hidden'}</span>
                </td>
                <td>
                  <div className="category-row-actions">
                    {fixed(c.slug) ? (
                      <span className="muted">Fixed top category</span>
                    ) : (
                      <>
                        <Link href={`?id=${c.id}`}>Edit</Link>
                        <ActionForm action={deleteCategoryAction} success="Category deleted.">
                          <AdminInput type="hidden" name="id" value={c.id} />
                          <AdminButton variant="ghost" type="submit">
                            Delete
                          </AdminButton>
                        </ActionForm>
                      </>
                    )}
                    <Link href={`/admin/products?category=${c.id}`}>Products</Link>
                    {parents.some((p) => p.id === c.id) ? <Link href={`?parent=${c.id}`}>Add child</Link> : null}
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
