import { query } from '@/lib/db';
import { normalizePdp, type ProductPdpFields } from '@/lib/product-pdp';

export type ProductRow = {
  id: number;
  category_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  stock_qty: number;
  sku: string | null;
  badge: string | null;
  grade_label: string | null;
  is_active: number;
  category_name?: string | null;
  category_slug?: string | null;
  images?: { path: string; is_primary: number }[];
} & ProductPdpFields & {
  pdp?: ReturnType<typeof normalizePdp>;
};

function mapProduct(row: ProductRow): ProductRow {
  const price = Number(row.price);
  const compare = row.compare_at_price != null ? Number(row.compare_at_price) : null;
  return {
    ...row,
    price,
    compare_at_price: compare,
    price_max: row.price_max != null ? Number(row.price_max) : null,
    pdp: normalizePdp(row)
  };
}

export async function attachImages<T extends { id: number }>(rows: T[]) {
  if (!rows.length) return rows.map((row) => ({ ...row, images: [] as { path: string; is_primary: number }[] }));
  const ids = rows.map((row) => row.id);
  const images: { product_id: number; path: string; is_primary: number }[] = [];
  for (const id of ids) {
    const part = await query<{ product_id: number; path: string; is_primary: number }[]>(
      'SELECT product_id, path, is_primary FROM product_images WHERE product_id = :id ORDER BY is_primary DESC, sort_order ASC',
      { id }
    );
    images.push(...part);
  }
  const grouped = new Map<number, { path: string; is_primary: number }[]>();
  for (const image of images) {
    const list = grouped.get(image.product_id) || [];
    list.push({ path: image.path, is_primary: image.is_primary });
    grouped.set(image.product_id, list);
  }
  return rows.map((row) => ({ ...row, images: grouped.get(row.id) || [] }));
}

export async function listProducts(input: {
  q?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
  min?: number;
  max?: number;
  inStock?: boolean;
  excludeId?: number;
}) {
  const q = (input.q || '').trim();
  const category = (input.category || '').trim();
  const sort = input.sort || 'newest';
  const page = Math.max(1, input.page || 1);
  const limit = Math.min(48, Math.max(1, input.limit || 24));
  const offset = (page - 1) * limit;
  const where: string[] = [];
  const params: Record<string, unknown> = {};
  if (!input.includeInactive) where.push('p.is_active = 1');
  if (q) {
    where.push('(p.name LIKE :q OR p.description LIKE :q OR p.sku LIKE :q)');
    params.q = `%${q}%`;
  }
  if (category) {
    where.push('(c.slug = :category OR c.id = :categoryId)');
    params.category = category;
    params.categoryId = Number(category) || 0;
  }
  if (input.min != null && !Number.isNaN(input.min)) {
    where.push('p.price >= :minPrice');
    params.minPrice = input.min;
  }
  if (input.max != null && !Number.isNaN(input.max)) {
    where.push('p.price <= :maxPrice');
    params.maxPrice = input.max;
  }
  if (input.inStock) where.push('p.stock_qty > 0');
  if (input.excludeId) {
    where.push('p.id <> :excludeId');
    params.excludeId = input.excludeId;
  }
  let orderBy = 'p.created_at DESC';
  if (sort === 'price-low') orderBy = 'p.price ASC';
  if (sort === 'price-high') orderBy = 'p.price DESC';
  if (sort === 'name') orderBy = 'p.name ASC';
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const countRows = await query<{ total: number }[]>(
    `SELECT COUNT(*) AS total FROM products p LEFT JOIN categories c ON c.id = p.category_id ${whereSql}`,
    params
  );
  const rows = await query<ProductRow[]>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     ${whereSql} ORDER BY ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
    params
  );
  const products = await attachImages(rows.map(mapProduct));
  const total = Number(countRows[0]?.total || 0);
  return { products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function listProductsBySlugs(slugs: string[], excludeId?: number) {
  const clean = [...new Set(slugs.map((slug) => String(slug || '').trim()).filter(Boolean))];
  if (!clean.length) return [];
  const placeholders = clean.map((_, index) => `:slug${index}`).join(', ');
  const params: Record<string, unknown> = {};
  clean.forEach((slug, index) => {
    params[`slug${index}`] = slug;
  });
  let excludeSql = '';
  if (excludeId) {
    excludeSql = ' AND p.id <> :excludeId';
    params.excludeId = excludeId;
  }
  const rows = await query<ProductRow[]>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.is_active = 1 AND p.slug IN (${placeholders})${excludeSql}`,
    params
  );
  const products = await attachImages(rows.map(mapProduct));
  const order = new Map(clean.map((slug, index) => [slug, index]));
  return products.sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
}

export async function getProduct(slugOrId: string) {
  const isId = /^\d+$/.test(slugOrId);
  const rows = await query<ProductRow[]>(
    `SELECT p.*, c.name AS category_name, c.slug AS category_slug
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     WHERE ${isId ? 'p.id = :key' : 'p.slug = :key'} LIMIT 1`,
    { key: isId ? Number(slugOrId) : slugOrId }
  );
  if (!rows.length) return null;
  const [product] = await attachImages([mapProduct(rows[0])]);
  return product;
}

export async function listCategories() {
  return query<{ id: number; name: string; slug: string; image: string | null; is_active: number; product_count: number }[]>(
    `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = 1) AS product_count
     FROM categories c WHERE c.is_active = 1 ORDER BY c.name ASC`
  );
}

export const STORE_NAV = [
  { name: 'Furniture', slug: 'furniture' },
  { name: 'New', slug: 'new' },
  { name: 'Outdoor', slug: 'outdoor' },
  { name: 'Bedding', slug: 'bedding' },
  { name: 'Bath', slug: 'bath' },
  { name: 'Lighting', slug: 'lighting' },
  { name: 'Rugs', slug: 'rugs' },
  { name: 'Windows', slug: 'windows' },
  { name: 'Pillows & Decor', slug: 'pillows-decor' },
  { name: 'Art & Mirrors', slug: 'art-mirrors' },
  { name: 'Tabletop & Bar', slug: 'tabletop-bar' },
  { name: 'Storage', slug: 'storage' },
  { name: 'Holidays', slug: 'holidays' },
  { name: 'Gifts', slug: 'gifts' }
] as const;

export async function ensureStoreCategories() {
  for (const category of STORE_NAV) {
    await query(
      `INSERT INTO categories (name, slug, is_active)
       SELECT :name, :slug, 1 FROM DUAL
       WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = :slug)`,
      { name: category.name, slug: category.slug }
    );
  }
}

export async function getCategory(slug: string) {
  const rows = await query<{ id: number; name: string; slug: string; image: string | null }[]>(
    'SELECT * FROM categories WHERE slug = :slug AND is_active = 1 LIMIT 1',
    { slug }
  );
  return rows[0] || null;
}
