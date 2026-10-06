import type { ReactNode } from 'react';

function jsonValue(value: unknown) {
  if (value == null || value === '') return '';
  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
}

export function ProductAdminFields({
  product,
  categories,
  images
}: {
  product?: Record<string, string | number | null>;
  categories: { id: number; name: string }[];
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
      <label>Category
        <select name="category_id" defaultValue={String(product?.category_id || '')} required={!isEdit}>
          <option value="">{isEdit ? 'Uncategorized' : 'Select a category'}</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>
      <div className="form-grid">
        <label>Price (min)<input name="price" type="number" step="0.01" defaultValue={product ? Number(product.price) : ''} required /></label>
        <label>Price max<input name="price_max" type="number" step="0.01" defaultValue={product?.price_max != null ? Number(product.price_max) : ''} /></label>
        <label>Compare at<input name="compare_at_price" type="number" step="0.01" defaultValue={product?.compare_at_price != null ? Number(product.compare_at_price) : ''} /></label>
        <label>Stock<input name="stock_qty" type="number" defaultValue={product ? Number(product.stock_qty) : 0} /></label>
        <label>SKU<input name="sku" defaultValue={String(product?.sku || '')} /></label>
        <label>Badge<input name="badge" defaultValue={String(product?.badge || '')} placeholder="Bestseller, Sale, New" /></label>
        <label>Grade<input name="grade_label" defaultValue={String(product?.grade_label || '')} placeholder="Contract Grade" /></label>
        <label>Collection key<input name="collection_key" defaultValue={String(product?.collection_key || '')} placeholder="montclair" /></label>
      </div>
      <label>Shown caption<input name="shown_caption" defaultValue={String(product?.shown_caption || '')} placeholder="Shown in Rustic Chenille..." /></label>
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

      <h3 className="admin-section-title">PDP content (JSON)</h3>
      <p className="admin-help">Paste arrays/objects as JSON. Leave blank to keep empty. Examples are in <code>web/data/products-seed.json</code>.</p>
      <AdminJsonField name="option_groups" label="Option groups" defaultValue={jsonValue(product?.option_groups)} placeholder='[{"name":"Furniture Finish","options":[{"name":"Tuscan Sun","image":"/assets/images/img5.jpeg"}]}]' />
      <AdminJsonField name="details_sections" label="Details sections" defaultValue={jsonValue(product?.details_sections)} />
      <AdminJsonField name="dimensions" label="Dimensions" defaultValue={jsonValue(product?.dimensions)} />
      <AdminJsonField name="faqs" label="FAQs" defaultValue={jsonValue(product?.faqs)} />
      <AdminJsonField name="related_searches" label="Related searches" defaultValue={jsonValue(product?.related_searches)} />
      <AdminJsonField name="related_category_slugs" label="Related categories" defaultValue={jsonValue(product?.related_category_slugs)} />
      <AdminJsonField name="ask_prompts" label="Ask prompts" defaultValue={jsonValue(product?.ask_prompts)} />
      <AdminJsonField name="paired_slugs" label="Frequently paired slugs" defaultValue={jsonValue(product?.paired_slugs)} placeholder='["gulfport-chair"]' />
      <AdminJsonField name="collection_slugs" label="Collection product slugs" defaultValue={jsonValue(product?.collection_slugs)} />
      <AdminJsonField name="similar_slugs" label="Similar product slugs" defaultValue={jsonValue(product?.similar_slugs)} />
      <AdminJsonField name="still_deciding" label="Still deciding links" defaultValue={jsonValue(product?.still_deciding)} />

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

function AdminJsonField({ name, label, defaultValue, placeholder }: { name: string; label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <label>
      {label}
      <textarea name={name} rows={5} defaultValue={defaultValue || ''} placeholder={placeholder} spellCheck={false} />
    </label>
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
