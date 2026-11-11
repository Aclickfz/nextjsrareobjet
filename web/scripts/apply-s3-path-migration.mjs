import fs from 'node:fs';
import mysql from 'mysql2/promise';

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const i = line.indexOf('=');
      let value = line.slice(i + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"'))
        || (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      return [line.slice(0, i).trim(), value];
    })
);

const conn = await mysql.createConnection({
  host: env.DB_HOST,
  port: Number(env.DB_PORT || 3306),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  multipleStatements: true
});

const sql = fs.readFileSync(new URL('../sql/migrations/002_s3_path_prefixes.sql', import.meta.url), 'utf8');
await conn.query(sql);
console.log('Migration 002 applied');

const [[pi]] = await conn.query(`
  SELECT COUNT(*) AS total,
    SUM(path LIKE 'uploads/%') AS legacy,
    SUM(path LIKE 'products/%') AS products
  FROM product_images
`);
const [[ca]] = await conn.query(`
  SELECT COUNT(*) AS total,
    SUM(image LIKE 'uploads/%') AS legacy,
    SUM(image LIKE 'category/%') AS category
  FROM categories WHERE image IS NOT NULL
`);
const [[sm]] = await conn.query(`
  SELECT COUNT(*) AS total,
    SUM(path LIKE 'uploads/%') AS legacy,
    SUM(path LIKE 'banner/%') AS banner
  FROM site_media
`);
console.log({ product_images: pi, categories: ca, site_media: sm });
await conn.end();
