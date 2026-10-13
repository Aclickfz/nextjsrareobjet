import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'justaclick',
  namedPlaceholders: true,
  connectTimeout: 8000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

function toJson(value) {
  if (value == null) return null;
  return JSON.stringify(value);
}

try {
  const seedPath = path.join(process.cwd(), 'data', 'products-seed.json');
  const products = JSON.parse(await fs.readFile(seedPath, 'utf8'));

  for (const item of products) {
    const [categories] = await connection.query(
      'SELECT id FROM categories WHERE slug = :slug LIMIT 1',
      { slug: item.category_slug }
    );
    let categoryId = categories[0]?.id || null;
    if (!categoryId) {
      const [created] = await connection.query(
        'INSERT INTO categories (name, slug, is_active) VALUES (:name, :slug, 1)',
        {
          name: item.category_slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          slug: item.category_slug
        }
      );
      categoryId = created.insertId;
    }

    const payload = {
      category_id: categoryId,
      name: item.name,
      slug: item.slug,
      description: item.description || null,
      price: item.price,
      price_max: item.price_max ?? null,
      compare_at_price: item.compare_at_price ?? null,
      stock_qty: item.stock_qty ?? 0,
      sku: item.sku || null,
      badge: item.badge || null,
      grade_label: item.grade_label || null,
      collection_key: item.collection_key || null,
      shown_caption: item.shown_caption || null,
      free_shipping: item.free_shipping ? 1 : 0,
      option_groups: toJson(item.option_groups),
      details_sections: toJson(item.details_sections),
      dimensions: toJson(item.dimensions),
      faqs: toJson(item.faqs),
      related_searches: toJson(item.related_searches),
      related_category_slugs: toJson(item.related_category_slugs),
      ask_prompts: toJson(item.ask_prompts),
      paired_slugs: toJson(item.paired_slugs),
      collection_slugs: toJson(item.collection_slugs),
      similar_slugs: toJson(item.similar_slugs),
      still_deciding: toJson(item.still_deciding),
      is_active: 1
    };

    const [existing] = await connection.query('SELECT id FROM products WHERE slug = :slug LIMIT 1', { slug: item.slug });
    let productId = existing[0]?.id;
    if (productId) {
      await connection.query(
        `UPDATE products SET
          category_id=:category_id, name=:name, description=:description, price=:price, price_max=:price_max,
          compare_at_price=:compare_at_price, stock_qty=:stock_qty, sku=:sku, badge=:badge, grade_label=:grade_label,
          collection_key=:collection_key, shown_caption=:shown_caption, free_shipping=:free_shipping,
          option_groups=:option_groups, details_sections=:details_sections, dimensions=:dimensions, faqs=:faqs,
          related_searches=:related_searches, related_category_slugs=:related_category_slugs, ask_prompts=:ask_prompts,
          paired_slugs=:paired_slugs, collection_slugs=:collection_slugs, similar_slugs=:similar_slugs,
          still_deciding=:still_deciding, is_active=:is_active
         WHERE id=:id`,
        { ...payload, id: productId }
      );
      await connection.query('DELETE FROM product_images WHERE product_id = :id', { id: productId });
    } else {
      const [result] = await connection.query(
        `INSERT INTO products (
          category_id, name, slug, description, price, price_max, compare_at_price, stock_qty, sku, badge, grade_label,
          collection_key, shown_caption, free_shipping, option_groups, details_sections, dimensions, faqs,
          related_searches, related_category_slugs, ask_prompts, paired_slugs, collection_slugs, similar_slugs,
          still_deciding, is_active
        ) VALUES (
          :category_id, :name, :slug, :description, :price, :price_max, :compare_at_price, :stock_qty, :sku, :badge, :grade_label,
          :collection_key, :shown_caption, :free_shipping, :option_groups, :details_sections, :dimensions, :faqs,
          :related_searches, :related_category_slugs, :ask_prompts, :paired_slugs, :collection_slugs, :similar_slugs,
          :still_deciding, :is_active
        )`,
        payload
      );
      productId = result.insertId;
    }

    const images = item.images || [];
    for (let index = 0; index < images.length; index += 1) {
      const imagePath = String(images[index]).replace(/^\//, '');
      await connection.query(
        'INSERT INTO product_images (product_id, path, sort_order, is_primary) VALUES (:product_id, :path, :sort_order, :is_primary)',
        { product_id: productId, path: imagePath, sort_order: index, is_primary: index === 0 ? 1 : 0 }
      );
    }
    console.log('Seeded', item.slug);
  }
  console.log(`Seeded ${products.length} products from products-seed.json`);
} finally {
  await connection.end();
}
