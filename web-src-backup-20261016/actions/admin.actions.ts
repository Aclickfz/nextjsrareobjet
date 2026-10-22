'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { AdminValidationError, type AdminActionResult } from '@/lib/admin-action-result';
import { validateAdminUpload, validateProductForm } from '@/lib/admin-validation';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from './auth.actions';
import { query, getPool } from '@/lib/db';
import { categoryPath, nonNegativeInteger as parseNonNegativeInteger } from '@/lib/catalog-tree';
import { adminCategories, STORE_NAV } from '@/repositories/catalog.repository';
import { slugify } from '@/lib/utils';
import { buildProductContent, type ContentKey } from '@/lib/product-content-fields';
import { updateOrderStatus } from '@/repositories/order.repository';
import type { ResultSetHeader } from 'mysql2/promise';

function nonNegativeInteger(value: unknown) {
  try { return parseNonNegativeInteger(value); }
  catch { throw new AdminValidationError('Enter a valid non-negative whole number.'); }
}

export async function dashboardData() {
  await requireAdmin();
  const stats = await query<Record<string, number>[]>(`
    SELECT
      (SELECT COUNT(*) FROM orders) AS orders_total,
      (SELECT COUNT(*) FROM orders WHERE status = 'pending') AS orders_pending,
      (SELECT COALESCE(SUM(total),0) FROM orders WHERE status IN ('confirmed','shipped','delivered')) AS revenue,
      (SELECT COUNT(*) FROM products WHERE is_active = 1) AS products_active,
      (SELECT COUNT(*) FROM products WHERE stock_qty <= 5 AND is_active = 1) AS low_stock,
      (SELECT COUNT(*) FROM users WHERE role = 'customer') AS customers
  `);
  const recentOrders = await query(
    `SELECT o.id, o.order_number, o.status, o.total, o.created_at, u.name AS customer_name
     FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC LIMIT 8`
  );
  const lowStock = await query(
    `SELECT id, name, sku, stock_qty, price FROM products WHERE is_active = 1 AND stock_qty <= 5 ORDER BY stock_qty ASC LIMIT 10`
  );
  return { stats: stats[0], recentOrders, lowStock };
}

async function saveProductActionImpl(formData: FormData) {
  await requireAdmin();
  validateProductForm(formData);
  const id = Number(formData.get('id') || 0);
  const name = String(formData.get('name') || '').trim();
  if (!name) throw new AdminValidationError('Name required');
  let slug = slugify(String(formData.get('slug') || name));
  const clash = await query<{ id: number }[]>('SELECT id FROM products WHERE slug = :slug AND id <> :id', { slug, id: id || 0 });
  if (clash.length) slug = `${slug}-${Date.now().toString(36)}`;

  const readJson = (key: ContentKey) => buildProductContent(key, formData);

  const categoryId = Number(formData.get('category_id') || 0);
  const categories = await adminCategories();
  if (!Number.isSafeInteger(categoryId) || categoryId <= 0 || !categories.some(c => c.id === categoryId)) throw new AdminValidationError('Select a valid category or subcategory');
  const data = {
    sort_order: nonNegativeInteger(formData.get('sort_order') || 0),
    category_id: categoryId,
    name,
    slug,
    description: String(formData.get('description') || '') || null,
    price: Number(formData.get('price') || 0),
    price_max: formData.get('price_max') ? Number(formData.get('price_max')) : null,
    compare_at_price: formData.get('compare_at_price') ? Number(formData.get('compare_at_price')) : null,
    stock_qty: Number(formData.get('stock_qty') || 0),
    sku: String(formData.get('sku') || '') || null,
    badge: String(formData.get('badge') || '') || null,
    grade_label: String(formData.get('grade_label') || '') || null,
    collection_key: String(formData.get('collection_key') || '') || null,
    shown_caption: String(formData.get('shown_caption') || '') || null,
    free_shipping: formData.get('free_shipping') === '1' ? 1 : 0,
    option_groups: readJson('option_groups'),
    details_sections: readJson('details_sections'),
    dimensions: readJson('dimensions'),
    faqs: readJson('faqs'),
    related_searches: readJson('related_searches'),
    related_category_slugs: readJson('related_category_slugs'),
    ask_prompts: readJson('ask_prompts'),
    paired_slugs: readJson('paired_slugs'),
    collection_slugs: readJson('collection_slugs'),
    similar_slugs: readJson('similar_slugs'),
    still_deciding: readJson('still_deciding'),
    is_active: formData.get('is_active') === '0' ? 0 : 1
  };
  let productId = id;
  if (id) {
    await getPool().execute(
      `UPDATE products SET sort_order=:sort_order, category_id=:category_id, name=:name, slug=:slug, description=:description, price=:price, price_max=:price_max,
       compare_at_price=:compare_at_price, stock_qty=:stock_qty, sku=:sku, badge=:badge, grade_label=:grade_label,
       collection_key=:collection_key, shown_caption=:shown_caption, free_shipping=:free_shipping,
       option_groups=:option_groups, details_sections=:details_sections, dimensions=:dimensions, faqs=:faqs,
       related_searches=:related_searches, related_category_slugs=:related_category_slugs, ask_prompts=:ask_prompts,
       paired_slugs=:paired_slugs, collection_slugs=:collection_slugs, similar_slugs=:similar_slugs,
       still_deciding=:still_deciding, is_active=:is_active
       WHERE id=:id`,
      { ...data, id }
    );
  } else {
    const [result] = await getPool().execute<ResultSetHeader>(
      `INSERT INTO products (
        sort_order, category_id, name, slug, description, price, price_max, compare_at_price, stock_qty, sku, badge, grade_label,
        collection_key, shown_caption, free_shipping, option_groups, details_sections, dimensions, faqs,
        related_searches, related_category_slugs, ask_prompts, paired_slugs, collection_slugs, similar_slugs,
        still_deciding, is_active
      ) VALUES (
        :sort_order, :category_id, :name, :slug, :description, :price, :price_max, :compare_at_price, :stock_qty, :sku, :badge, :grade_label,
        :collection_key, :shown_caption, :free_shipping, :option_groups, :details_sections, :dimensions, :faqs,
        :related_searches, :related_category_slugs, :ask_prompts, :paired_slugs, :collection_slugs, :similar_slugs,
        :still_deciding, :is_active
      )`,
      data
    );
    productId = result.insertId;
  }
  const uploaded = await storeUpload(formData.get('image'), 'products');
  if (uploaded) {
    await getPool().execute('UPDATE product_images SET is_primary = 0 WHERE product_id = :product_id', { product_id: productId });
    await getPool().execute(
      'INSERT INTO product_images (product_id, path, sort_order, is_primary) VALUES (:product_id, :path, 0, 1)',
      { product_id: productId, path: uploaded }
    );
  }
  const gallery = formData.getAll('gallery');
  const sortRows = await query<{ next_sort: number }[]>(
    'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort FROM product_images WHERE product_id = :product_id AND is_primary = 0',
    { product_id: productId }
  );
  let sort = Number(sortRows[0]?.next_sort || 1);
  for (const file of gallery) {
    const extra = await storeUpload(file, 'products');
    if (!extra) continue;
    await getPool().execute(
      'INSERT INTO product_images (product_id, path, sort_order, is_primary) VALUES (:product_id, :path, :sort_order, 0)',
      { product_id: productId, path: extra, sort_order: sort }
    );
    sort += 1;
  }
  revalidatePath('/admin/products');
  revalidatePath(`/products/${slug}`);
  revalidatePath('/', 'layout');
  redirect(`/admin/products/${productId}`);
}

async function deleteProductGalleryImageActionImpl(formData: FormData) {
  await requireAdmin();
  const productId = Number(formData.get('product_id'));
  const imageId = Number(formData.get('image_id'));
  if (!Number.isSafeInteger(productId) || productId <= 0 || !Number.isSafeInteger(imageId) || imageId <= 0) {
    throw new AdminValidationError('Invalid product image');
  }
  const images = await query<{ slug: string }[]>(
    `SELECT p.slug FROM product_images pi
     JOIN products p ON p.id = pi.product_id
     WHERE pi.id = :image_id AND pi.product_id = :product_id AND pi.is_primary = 0`,
    { image_id: imageId, product_id: productId }
  );
  if (!images.length) throw new AdminValidationError('Gallery image not found');
  await getPool().execute(
    'DELETE FROM product_images WHERE id = :image_id AND product_id = :product_id AND is_primary = 0',
    { image_id: imageId, product_id: productId }
  );
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath('/admin/products');
  revalidatePath(`/products/${images[0].slug}`);
  revalidatePath('/', 'layout');
}

async function deleteProductActionImpl(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id'));
  if (!Number.isSafeInteger(id) || id <= 0) throw new AdminValidationError('Invalid product ID');
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('SELECT id FROM products WHERE id = :id FOR UPDATE', { id });
    await conn.execute('DELETE FROM cart_items WHERE product_id = :id', { id });
    await conn.execute('DELETE FROM wishlists WHERE product_id = :id', { id });
    await conn.execute('DELETE FROM product_images WHERE product_id = :id', { id });
    // Order snapshots and inventory history remain available after catalog deletion.
    await conn.execute('DELETE FROM products WHERE id = :id', { id });
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
  revalidatePath('/admin/products');
  revalidatePath('/admin/inventory');
  revalidatePath('/admin/dashboard');
  revalidatePath('/', 'layout');
}

async function deactivateProductActionImpl(formData: FormData) {
  await requireAdmin();
  await getPool().execute('UPDATE products SET is_active = 0 WHERE id = :id', { id: Number(formData.get('id')) });
  revalidatePath('/admin/products');
}

async function adjustStockActionImpl(formData: FormData) {
  const admin = await requireAdmin();
  const id = Number(formData.get('product_id'));
  const change = Number(formData.get('change_qty'));
  const note = String(formData.get('note') || '');
  if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(change) || !change) throw new AdminValidationError('Choose a product and enter a non-zero whole number for the stock change.', { change_qty: ['Enter a non-zero whole number.'] });
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.execute('SELECT stock_qty FROM products WHERE id = :id FOR UPDATE', { id });
    const product = (rows as { stock_qty: number }[])[0];
    if (!product) throw new AdminValidationError('Product not found');
    if (product.stock_qty + change < 0) throw new AdminValidationError('Stock cannot go below zero');
    await conn.execute('UPDATE products SET stock_qty = stock_qty + :change WHERE id = :id', { change, id });
    await conn.execute(
      `INSERT INTO inventory_logs (product_id, change_qty, reason, created_by, note) VALUES (:id, :change, 'adjust', :uid, :note)`,
      { id, change, uid: admin.id, note }
    );
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
  revalidatePath('/admin/inventory');
}

async function storeUpload(file: FormDataEntryValue | null, folder: string) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) throw new AdminValidationError('Images only, max 5MB');
  const dir = path.join(process.cwd(), 'public', 'uploads', folder);
  fs.mkdirSync(dir, { recursive: true });
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
  fs.writeFileSync(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return `uploads/${folder}/${filename}`;
}

async function saveCategoryActionImpl(formData: FormData) {
  await requireAdmin();
  const id = nonNegativeInteger(formData.get('id') || 0);
  const categories = await adminCategories();
  const existing = categories.find(c => c.id === id);
  if (id && !existing) throw new AdminValidationError('Category not found');
  if (existing && STORE_NAV.some(root => root.slug === existing.slug)) throw new AdminValidationError('Top categories are fixed');
  const parent_id = nonNegativeInteger(formData.get('parent_id') || 0);
  const parent = categories.find(c => c.id === parent_id);
  if (!parent) throw new AdminValidationError('Choose a parent category');
  const ancestors = categoryPath(categories, parent_id);
  if (ancestors.length > 3 || !STORE_NAV.some(root => root.slug === ancestors[0]?.slug) || ancestors.some(c => c.id === id)) throw new AdminValidationError('Choose a top category, category or subcategory as parent');
  if (id) {
    const descendants = categories.filter(c => categoryPath(categories, c.id).some(p => p.id === id));
    const height = Math.max(...descendants.map(c => categoryPath(categories, c.id).length - categoryPath(categories, id).length), 0);
    if (ancestors.length + 1 + height > 4) throw new AdminValidationError('Move child subcategories first');
  }
  const name = String(formData.get('name') || '').trim();
  const slug = slugify(String(formData.get('slug') || name));
  if (!name || name.length > 200 || !slug || slug.length > 200) throw new AdminValidationError('Enter a valid name and slug (max 200 characters)');
  if (STORE_NAV.some(root => root.slug === slug)) throw new AdminValidationError('This slug belongs to a fixed top category');
  if (categories.some(c => c.slug === slug && c.id !== id)) throw new AdminValidationError('Slug already exists');
  const image = await storeUpload(formData.get('image_file'), 'categories') || existing?.image || null;
  const data = { id, name, slug, image, parent_id, sort_order: nonNegativeInteger(formData.get('sort_order') || 0), is_active: formData.get('is_active') === '0' ? 0 : 1 };
  await getPool().execute(id
    ? 'UPDATE categories SET name=:name, slug=:slug, image=:image, parent_id=:parent_id, sort_order=:sort_order, is_active=:is_active WHERE id=:id'
    : 'INSERT INTO categories (name, slug, image, parent_id, sort_order, is_active) VALUES (:name, :slug, :image, :parent_id, :sort_order, :is_active)', data);
  revalidatePath('/', 'layout');
}

async function deleteCategoryActionImpl(formData: FormData) {
  await requireAdmin();
  const id = nonNegativeInteger(formData.get('id'));
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.execute('SELECT slug FROM categories WHERE id=:id FOR UPDATE', { id });
    const category = (rows as { slug: string }[])[0];
    if (!category || STORE_NAV.some(root => root.slug === category.slug)) throw new AdminValidationError('Top categories are fixed');
    const [children] = await conn.execute('SELECT id FROM categories WHERE parent_id=:id LIMIT 1', { id });
    const [products] = await conn.execute('SELECT id FROM products WHERE category_id=:id LIMIT 1', { id });
    if ((children as unknown[]).length || (products as unknown[]).length) throw new AdminValidationError('Move products and child categories before deleting this category');
    await conn.execute('DELETE FROM categories WHERE id=:id', { id });
    await conn.commit();
  } catch (error) { await conn.rollback(); throw error; } finally { conn.release(); }
  revalidatePath('/', 'layout');
}

async function saveTrackingActionImpl(formData: FormData) {
  await requireAdmin();
  const { ensureOrderTrackingColumns } = await import('@/repositories/order.repository');
  await ensureOrderTrackingColumns();
  const id = Number(formData.get('id'));
  await getPool().execute(
    'UPDATE orders SET tracking_number = :tracking_number, carrier = :carrier WHERE id = :id',
    {
      id,
      tracking_number: String(formData.get('tracking_number') || '').trim() || null,
      carrier: String(formData.get('carrier') || '').trim() || null
    }
  );
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
}

async function orderStatusActionImpl(formData: FormData) {
  const admin = await requireAdmin();
  const id = Number(formData.get('id'));
  const status = String(formData.get('status') || '');
  await updateOrderStatus(id, status, admin.id, formData.get('mark_paid') === '1');
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
}

async function saveCustomerActionImpl(formData: FormData) {
  await requireAdmin();
  await getPool().execute(
    "UPDATE users SET notes = :notes, phone = :phone WHERE id = :id AND role = 'customer'",
    { notes: String(formData.get('notes') || ''), phone: String(formData.get('phone') || ''), id: Number(formData.get('id')) }
  );
  revalidatePath('/admin/customers');
}

// Return expected errors explicitly: production Server Actions redact thrown messages.
async function runAdminAction(action: (data: FormData) => Promise<void>, data: FormData): Promise<AdminActionResult | void> {
  try {
    await requireAdmin();
    validateAdminUpload(data);
    await action(data);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof AdminValidationError) return { error: error.message, fieldErrors: error.fieldErrors };
    console.error('Admin action failed', error);
    return { error: 'Unable to save these changes. Please try again.' };
  }
}

export async function saveProductAction(data: FormData): Promise<AdminActionResult | void> {
  return runAdminAction(saveProductActionImpl, data);
}

export async function deleteProductGalleryImageAction(data: FormData): Promise<AdminActionResult | void> {
  return runAdminAction(deleteProductGalleryImageActionImpl, data);
}

export async function deleteProductAction(data: FormData): Promise<AdminActionResult | void> {
  return runAdminAction(deleteProductActionImpl, data);
}

export async function deactivateProductAction(data: FormData): Promise<AdminActionResult | void> {
  return runAdminAction(deactivateProductActionImpl, data);
}

export async function adjustStockAction(data: FormData): Promise<AdminActionResult | void> {
  return runAdminAction(adjustStockActionImpl, data);
}

export async function saveCategoryAction(data: FormData): Promise<AdminActionResult | void> {
  return runAdminAction(saveCategoryActionImpl, data);
}

export async function deleteCategoryAction(data: FormData): Promise<AdminActionResult | void> {
  return runAdminAction(deleteCategoryActionImpl, data);
}

export async function saveTrackingAction(data: FormData): Promise<AdminActionResult | void> {
  return runAdminAction(saveTrackingActionImpl, data);
}

export async function orderStatusAction(data: FormData): Promise<AdminActionResult | void> {
  return runAdminAction(orderStatusActionImpl, data);
}

export async function saveCustomerAction(data: FormData): Promise<AdminActionResult | void> {
  return runAdminAction(saveCustomerActionImpl, data);
}
