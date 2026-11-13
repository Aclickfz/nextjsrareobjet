import Link from 'next/link';
import { AdminInput, AdminSelect } from '@/components/admin/AdminControls';
import { AdminActionForm as ActionForm, AdminButton, AdminFilterForm } from '@/components/admin/AdminForm';
import { deleteShopTileAction, saveShopTileAction } from '@/actions/admin.actions';
import { HOMEPAGE_SHOWCASES } from '@/lib/homepage-showcases';
import { imgSrc } from '@/lib/utils';
import { getShopTile, listShopTiles } from '@/repositories/shop-tiles.repository';

export const dynamic = 'force-dynamic';

function tileSrc(path: string | null) {
  if (!path) return '';
  if (path.startsWith('assets/')) return `/${path.replace(/^\//, '')}`;
  return imgSrc(path);
}

export default async function ShopCategoriesAdminPage({
  searchParams
}: {
  searchParams: Promise<{ id?: string; showcase?: string }>
}) {
  const { id, showcase } = await searchParams;
  const tiles = await listShopTiles(showcase || undefined);
  const editing = id ? await getShopTile(Number(id)) : null;
  const showcaseOptions = HOMEPAGE_SHOWCASES.map((item) => ({ value: item.slug, label: item.name }));

  return (
    <>
      <div className="page-head">
        <div>
          <h2>Shop by Category</h2>
          <p>Create, edit, and delete homepage Shop by Category tiles. Storefront auto-slides these items.</p>
        </div>
        <div className="page-head-actions">
          <AdminButton asChild variant="outline">
            <Link href="/admin/shop-categories">New tile</Link>
          </AdminButton>
        </div>
      </div>

      <div className="panel panel-form">
        <div className="panel-head">
          <h3>{editing ? `Edit ${editing.name}` : 'Add Shop by Category tile'}</h3>
        </div>
        <ActionForm
          key={editing?.id || `new-${showcase || 'all'}`}
          className="admin-form admin-form-wide"
          action={saveShopTileAction}
          success={editing ? 'Tile updated.' : 'Tile created.'}
        >
          <AdminInput type="hidden" name="id" value={editing?.id || 0} />
          <div className="form-grid">
            <label>
              Showcase section
              <AdminSelect name="showcase_slug" defaultValue={editing?.showcase_slug || showcase || showcaseOptions[0]?.value || ''}>
                {showcaseOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </AdminSelect>
            </label>
            <label>
              Name
              <AdminInput name="name" maxLength={200} defaultValue={editing?.name || ''} required />
            </label>
            <label>
              Link URL
              <AdminInput name="href" defaultValue={editing?.href || '/categories/furniture'} placeholder="/categories/furniture" required />
            </label>
            <label>
              Sort order
              <AdminInput type="number" name="sort_order" min="0" step="1" defaultValue={editing?.sort_order ?? tiles.length} />
            </label>
            <label>
              Status
              <AdminSelect name="is_active" defaultValue={editing?.is_active ?? 1}>
                <option value="1">Active</option>
                <option value="0">Hidden</option>
              </AdminSelect>
            </label>
            <label className="admin-file-field">
              Image {editing?.image ? '(replace optional)' : ''}
              <AdminInput type="file" name="image_file" accept="image/*" required={!editing} />
            </label>
          </div>
          {editing?.image ? (
            <div className="admin-main-preview">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tileSrc(editing.image)} alt="" />
            </div>
          ) : null}
          <div className="admin-form-actions">
            {editing ? (
              <AdminButton asChild variant="outline">
                <Link href="/admin/shop-categories">Cancel</Link>
              </AdminButton>
            ) : null}
            <AdminButton type="submit">{editing ? 'Save changes' : 'Create tile'}</AdminButton>
          </div>
        </ActionForm>
      </div>

      <AdminFilterBar current={showcase || ''} />

      <div className="panel">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Showcase</th>
              <th>Link</th>
              <th>Order</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tiles.map((tile) => {
              const section = showcaseOptions.find((item) => item.value === tile.showcase_slug)?.label || tile.showcase_slug;
              return (
                <tr key={tile.id}>
                  <td>{tile.image ? <img className="thumb" src={tileSrc(tile.image)} alt="" /> : <span className="thumb" />}</td>
                  <td>{tile.name}</td>
                  <td>{section}</td>
                  <td className="muted">{tile.href}</td>
                  <td>{tile.sort_order}</td>
                  <td><span className={tile.is_active ? 'pill' : 'pill off'}>{tile.is_active ? 'Active' : 'Hidden'}</span></td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/shop-categories?id=${tile.id}`}>Edit</Link>
                      <ActionForm action={deleteShopTileAction} success="Tile deleted." confirmMessage={`Delete "${tile.name}"?`}>
                        <AdminInput type="hidden" name="id" value={tile.id} />
                        <AdminButton variant="ghost" type="submit">Delete</AdminButton>
                      </ActionForm>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AdminFilterBar({ current }: { current: string }) {
  return (
    <AdminFilterForm className="filters" key={current || 'all'}>
      <AdminSelect name="showcase" aria-label="Filter showcase" defaultValue={current}>
        <option value="">All sections</option>
        {HOMEPAGE_SHOWCASES.map((item) => (
          <option key={item.slug} value={item.slug}>{item.name}</option>
        ))}
      </AdminSelect>
      <div className="filters-actions">
        <AdminButton type="submit">Filter</AdminButton>
      </div>
    </AdminFilterForm>
  );
}
