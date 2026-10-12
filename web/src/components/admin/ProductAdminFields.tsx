import { AdminInput, AdminTextarea, AdminSelect, AdminCheckbox } from '@/components/admin/AdminControls';
import { ProductContentFields } from './ProductContentFields';
import { CategoryPicker } from './CategoryPicker';
import { ProductGalleryImage } from './ProductGalleryImage';
import type { CategoryNode } from '@/lib/catalog-tree';
import type { ReactNode } from 'react';

export function ProductAdminFields({
  product,
  categories,
  images
}: {
  product?: Record<string, string | number | null>;
  categories: CategoryNode[];
  images?: { id: number; path: string; is_primary: number }[];
}) {
  const isEdit = Boolean(product?.id);
  return (
    <>
      {isEdit ? <AdminInput type="hidden" name="id" value={String(product!.id)} /> : null}
      <div className="form-grid">
        <label>Name<AdminInput name="name" defaultValue={String(product?.name || '')} required /></label>
        <label>Slug<AdminInput name="slug" defaultValue={String(product?.slug || '')} placeholder="Auto from name" /></label>
      </div>
      <CategoryPicker categories={categories} selectedId={Number(product?.category_id || 0)} />
      <label>Product sort order<AdminInput type="number" name="sort_order" min="0" step="1" defaultValue={Number(product?.sort_order || 0)} /></label>
      <p className="admin-help">Lower numbers appear first in the subcategory. <a href="/admin/categories" target="_blank" rel="noopener noreferrer">Manage categories and subcategories</a></p>
      <div className="form-grid">
        <label>Price (optional; defaults to 0)<AdminInput name="price" type="number" step="0.01" defaultValue={product ? Number(product.price) : ''} /></label>
        <label>Price max<AdminInput name="price_max" type="number" step="0.01" defaultValue={product?.price_max != null ? Number(product.price_max) : ''} /></label>
        <label>Compare at<AdminInput name="compare_at_price" type="number" step="0.01" defaultValue={product?.compare_at_price != null ? Number(product.compare_at_price) : ''} /></label>
        <label>Stock<AdminInput name="stock_qty" type="number" defaultValue={product ? Number(product.stock_qty) : 0} /></label>
        <label>SKU<AdminInput name="sku" defaultValue={String(product?.sku || '')} /></label>
        <label>Badge<AdminInput name="badge" defaultValue={String(product?.badge || '')} placeholder="Bestseller, Sale, New" /></label>
        <label>Grade<AdminInput name="grade_label" defaultValue={String(product?.grade_label || '')} placeholder="Contract Grade" /></label>
        <label>Collection key<AdminInput name="collection_key" defaultValue={String(product?.collection_key || '')} placeholder="montclair" /></label>
      </div>
      <label>Shown caption (optional)<AdminTextarea name="shown_caption" rows={4} defaultValue={String(product?.shown_caption || '')} placeholder="Shown in Rustic Chenille..." /></label>
      <label className="form-check">
        <AdminCheckbox name="free_shipping" value="1" defaultChecked={Boolean(Number(product?.free_shipping || 0))} />
        Free shipping
      </label>
      <label>Description<AdminTextarea name="description" rows={4} defaultValue={String(product?.description || '')} /></label>
      {isEdit ? (
        <label>Storefront
          <AdminSelect name="is_active" defaultValue={String(product?.is_active ?? 1)}>
            <option value="1">Live</option>
            <option value="0">Hidden</option>
          </AdminSelect>
        </label>
      ) : null}

      <ProductContentFields product={product} />

      {images?.length ? (
        <div className="product-gallery-grid">
          {images.map((image) => (
            <ProductGalleryImage key={image.id} image={image} productId={Number(product?.id)} />
          ))}
        </div>
      ) : null}
      <label>{isEdit ? 'Replace main image' : 'Main image'}<AdminInput name="image" type="file" accept="image/*" /></label>
      <label>{isEdit ? 'Add gallery image' : 'Gallery image'}<AdminInput name="gallery" type="file" accept="image/*" /></label>
    </>
  );
}

export function ProductAdminShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <>
      <div className="page-head"><div><h2>{title}</h2><p>{subtitle}</p></div></div>
      <div className="panel">{children}</div>
    </>
  );
}
