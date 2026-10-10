import { ProductContentFields } from './ProductContentFields';
import { CategoryPicker } from './CategoryPicker';
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
      {isEdit ? <input type="hidden" name="id" value={String(product!.id)} /> : null}
      <div className="form-grid">
        <label>Name<input name="name" defaultValue={String(product?.name || '')} required /></label>
        <label>Slug<input name="slug" defaultValue={String(product?.slug || '')} placeholder="Auto from name" /></label>
      </div>
      <CategoryPicker categories={categories} selectedId={Number(product?.category_id || 0)} />
      <label>Product sort order<input type="number" name="sort_order" min="0" step="1" defaultValue={Number(product?.sort_order || 0)} /></label>
      <p className="admin-help">Lower numbers appear first in the subcategory. <a href="/admin/categories" target="_blank" rel="noopener noreferrer">Manage categories and subcategories</a></p>
      <div className="form-grid">
        <label>Price (optional; defaults to 0)<input name="price" type="number" step="0.01" defaultValue={product ? Number(product.price) : ''} /></label>
        <label>Price max<input name="price_max" type="number" step="0.01" defaultValue={product?.price_max != null ? Number(product.price_max) : ''} /></label>
        <label>Compare at<input name="compare_at_price" type="number" step="0.01" defaultValue={product?.compare_at_price != null ? Number(product.compare_at_price) : ''} /></label>
        <label>Stock<input name="stock_qty" type="number" defaultValue={product ? Number(product.stock_qty) : 0} /></label>
        <label>SKU<input name="sku" defaultValue={String(product?.sku || '')} /></label>
        <label>Badge<input name="badge" defaultValue={String(product?.badge || '')} placeholder="Bestseller, Sale, New" /></label>
        <label>Grade<input name="grade_label" defaultValue={String(product?.grade_label || '')} placeholder="Contract Grade" /></label>
        <label>Collection key<input name="collection_key" defaultValue={String(product?.collection_key || '')} placeholder="montclair" /></label>
      </div>
      <label>Shown caption (optional)<textarea name="shown_caption" rows={4} defaultValue={String(product?.shown_caption || '')} placeholder="Shown in Rustic Chenille..." /></label>
      <label className="form-check">
        <input type="checkbox" name="free_shipping" value="1" defaultChecked={Boolean(Number(product?.free_shipping || 0))} />
        Free shipping
      </label>
      <label>Description<textarea name="description" rows={4} defaultValue={String(product?.description || '')} /></label>
      {isEdit ? (
        <label>Storefront
          <select name="is_active" defaultValue={String(product?.is_active ?? 1)}>
            <option value="1">Live</option>
            <option value="0">Hidden</option>
          </select>
        </label>
      ) : null}

      <ProductContentFields product={product} />

      {images?.length ? (
        <div className="form-grid">
          {images.map((image) => (
            <img key={image.id} className="thumb" src={`/${String(image.path).replace(/^\//, '')}`} alt="" />
          ))}
        </div>
      ) : null}
      <label>{isEdit ? 'Replace main image' : 'Main image'}<input name="image" type="file" accept="image/*" /></label>
      <label>{isEdit ? 'Add gallery images' : 'Gallery images'}<input name="gallery" type="file" accept="image/*" multiple /></label>
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
