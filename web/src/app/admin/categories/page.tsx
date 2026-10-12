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
  const fixed = (slug: string) => STORE_NAV.some(root => root.slug === slug);
  const editing = categories.find(c => String(c.id) === id && !fixed(c.slug));
  const parents = categories.filter(c => categoryPath(categories, c.id).length <= 3 && fixed(categoryPath(categories, c.id)[0]?.slug) && !categoryPath(categories, c.id).some(p => p.id === editing?.id));
  return <>
    <div className="page-head"><div><h2>Categories, subcategories & product categories</h2><p>Top navigation stays fixed. Furniture / Living Room / Sofas and Furniture / Living Room / Sectional Sofas use Living Room as the same parent. Add a child under a subcategory only when needed. Lower sort numbers appear first.</p></div></div>
    <div className="panel"><div className="panel-head"><h3>{editing ? `Edit ${editing.name}` : 'New category / subcategory'}</h3><a href="/admin/categories">New</a></div>
      <ActionForm key={editing?.id || `new-${parent || ""}`} className="admin-form" action={saveCategoryAction} success="Category saved.">
        <AdminInput type="hidden" name="id" value={editing?.id || 0} />
        <label>Parent category<CategoryParentCombobox options={parents.map(category => ({ id: category.id, label: categoryPath(categories, category.id).map(item => item.name).join(' / ') }))} defaultValue={String(editing?.parent_id || (parents.some(category => String(category.id) === parent) ? parent : ''))} /></label>
        <div className="form-grid"><label>Name<AdminInput name="name" maxLength={200} defaultValue={editing?.name || ''} required /></label><label>Slug<AdminInput name="slug" maxLength={200} defaultValue={editing?.slug || ''} placeholder="Auto from name" /></label><label>Sort order<AdminInput type="number" name="sort_order" min="0" step="1" defaultValue={editing?.sort_order || 0} /></label></div>
        <label>Status<AdminSelect name="is_active" defaultValue={editing?.is_active ?? 1}><option value="1">Active</option><option value="0">Hidden (including descendants)</option></AdminSelect></label>
        <label>Image<AdminInput type="file" name="image_file" accept="image/*" /></label><AdminButton type="submit">{editing ? 'Save changes' : 'Create category'}</AdminButton>
      </ActionForm>
    </div>
    <div className="panel"><table className="admin-table"><thead><tr><th>Category path</th><th>Slug</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead><tbody>{categories.map(c => <tr key={c.id}>
      <td>{categoryPath(categories, c.id).map(p => p.name).join(' / ')}</td><td>{c.slug}</td><td>{c.sort_order}</td><td>{c.is_active ? 'Active' : 'Hidden'}</td>
      <td><div className="category-row-actions">{fixed(c.slug) ? <span>Fixed top category</span> : <><a href={`?id=${c.id}`}>Edit</a><ActionForm action={deleteCategoryAction} success="Category deleted."><AdminInput type="hidden" name="id" value={c.id} /><AdminButton type="submit">Delete empty category</AdminButton></ActionForm></>} <a href={`/admin/products?category=${c.id}`}>Products</a> {parents.some(p => p.id === c.id) && <a href={`?parent=${c.id}`}>Add child category</a>}</div></td>
    </tr>)}</tbody></table></div>
  </>;
}
