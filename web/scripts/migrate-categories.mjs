import mysql from 'mysql2/promise';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');
const db = await mysql.createConnection({ host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '', database: process.env.DB_NAME || 'justaclick', connectTimeout: 8000, ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined });
try {
  for (const sql of [
    'ALTER TABLE categories ADD COLUMN parent_id INT NULL',
    'ALTER TABLE categories ADD COLUMN sort_order INT NOT NULL DEFAULT 0',
    'ALTER TABLE products ADD COLUMN sort_order INT NOT NULL DEFAULT 0',
    'ALTER TABLE categories ADD INDEX idx_categories_parent (parent_id, sort_order)',
    'ALTER TABLE products ADD INDEX idx_products_category_sort (category_id, sort_order)'
  ]) {
    try { await db.query(sql); } catch (error) {
      if (!['ER_DUP_FIELDNAME', 'ER_DUP_KEYNAME'].includes(error.code)) throw error;
    }
  }
  const roots = [['Furniture','furniture'],['New','new'],['Outdoor','outdoor'],['Bedding','bedding'],['Bath','bath'],['Lighting','lighting'],['Rugs','rugs'],['Windows','windows'],['Pillows & Decor','pillows-decor'],['Art & Mirrors','art-mirrors'],['Tabletop & Bar','tabletop-bar'],['Storage','storage'],['Holidays','holidays'],['Gifts','gifts']];
  for (const [name, slug] of roots) {
    await db.execute('INSERT INTO categories (name, slug, is_active) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE slug = VALUES(slug)', [name, slug]);
  }
  console.log('Category hierarchy and product ordering migration completed. Existing categories and products preserved.');
} finally { await db.end(); }
