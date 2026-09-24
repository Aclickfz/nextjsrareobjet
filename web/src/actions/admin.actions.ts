'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from './auth.actions';
import { query, getPool } from '@/lib/db';
import { slugify } from '@/lib/utils';
import { updateOrderStatus } from '@/repositories/order.repository';
import type { ResultSetHeader } from 'mysql2/promise';

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

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id') || 0);
  const name = String(formData.get('name') || '').trim();
  if (!name) throw new Error('Name required');
  let slug = slugify(String(formData.get('slug') || name));
  const clash = await query<{ id: number }[]>('SELECT id FROM products WHERE slug = :slug AND id <> :id', { slug, id: id || 0 });
  if (clash.length) slug = `${slug}-${Date.now().toString(36)}`;
  const data = {
    category_id: formData.get('category_id') ? Number(formData.get('category_id')) : null,
    name,
    slug,
    description: String(formData.get('description') || '') || null,
    price: Number(formData.get('price') || 0),
    compare_at_price: formData.get('compare_at_price') ? Number(formData.get('compare_at_price')) : null,
    stock_qty: Number(formData.get('stock_qty') || 0),
    sku: String(formData.get('sku') || '') || null,
    badge: String(formData.get('badge') || '') || null,
    grade_label: String(formData.get('grade_label') || '') || null,
    is_active: formData.get('is_active') === '0' ? 0 : 1
  };
  let productId = id;
  if (id) {
    await getPool().execute(
      `UPDATE products SET category_id=:category_id, name=:name, slug=:slug, description=:description, price=:price,
       compare_at_price=:compare_at_price, stock_qty=:stock_qty, sku=:sku, badge=:badge, grade_label=:grade_label, is_active=:is_active
       WHERE id=:id`,
      { ...data, id }
    );
  } else {
    const [result] = await getPool().execute<ResultSetHeader>(
      `INSERT INTO products (category_id, name, slug, description, price, compare_at_price, stock_qty, sku, badge, grade_label, is_active)
       VALUES (:category_id, :name, :slug, :description, :price, :compare_at_price, :stock_qty, :sku, :badge, :grade_label, :is_active)`,
      data
    );
    productId = result.insertId;
  }
  const uploaded = await storeUpload(formData.get('image'), 'products');
  if (uploaded) {
    await getPool().execute(
      'INSERT INTO product_images (product_id, path, sort_order, is_primary) VALUES (:product_id, :path, 0, 1)',
      { product_id: productId, path: uploaded }
    );
  }
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deactivateProductAction(formData: FormData) {
  await requireAdmin();
  await getPool().execute('UPDATE products SET is_active = 0 WHERE id = :id', { id: Number(formData.get('id')) });
  revalidatePath('/admin/products');
}

export async function adjustStockAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = Number(formData.get('product_id'));
  const change = Number(formData.get('change_qty'));
  const note = String(formData.get('note') || '');
  if (!id || !change) throw new Error('Product and quantity change are required');
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.execute('SELECT stock_qty FROM products WHERE id = :id FOR UPDATE', { id });
    const product = (rows as { stock_qty: number }[])[0];
    if (!product) throw new Error('Product not found');
    if (product.stock_qty + change < 0) throw new Error('Stock cannot go below zero');
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
  if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) throw new Error('Images only, max 5MB');
  const dir = path.join(process.cwd(), 'public', 'uploads', folder);
  fs.mkdirSync(dir, { recursive: true });
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${Date.now()}-${safe}`;
  fs.writeFileSync(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return `uploads/${folder}/${filename}`;
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get('id') || 0);
  const name = String(formData.get('name') || '').trim();
  if (!name) throw new Error('Name required');
  const slug = slugify(String(formData.get('slug') || name));
  const uploaded = await storeUpload(formData.get('image_file'), 'categories');
  const image = uploaded || String(formData.get('image') || '') || null;
  const is_active = formData.get('is_active') === '0' ? 0 : 1;
  if (id) {
    await getPool().execute(
      'UPDATE categories SET name=:name, slug=:slug, image=:image, is_active=:is_active WHERE id=:id',
      { name, slug, image, is_active, id }
    );
  } else {
    await getPool().execute(
      'INSERT INTO categories (name, slug, image, is_active) VALUES (:name, :slug, :image, :is_active)',
      { name, slug, image, is_active }
    );
  }
  revalidatePath('/admin/categories');
}

export async function orderStatusAction(formData: FormData) {
  const admin = await requireAdmin();
  const id = Number(formData.get('id'));
  const status = String(formData.get('status') || '');
  await updateOrderStatus(id, status, admin.id, formData.get('mark_paid') === '1');
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
}

export async function saveCustomerAction(formData: FormData) {
  await requireAdmin();
  await getPool().execute(
    "UPDATE users SET notes = :notes, phone = :phone WHERE id = :id AND role = 'customer'",
    { notes: String(formData.get('notes') || ''), phone: String(formData.get('phone') || ''), id: Number(formData.get('id')) }
  );
  revalidatePath('/admin/customers');
}
