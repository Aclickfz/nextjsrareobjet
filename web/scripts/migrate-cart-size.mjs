import fs from 'node:fs/promises';
import mysql from 'mysql2/promise';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'justaclick',
  connectTimeout: 8000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

try {
  const [columns] = await connection.query('SHOW COLUMNS FROM cart_items');
  if (!columns.some(column => column.Field === 'size')) {
    const sql = await fs.readFile(new URL('../sql/cart-size-migration.sql', import.meta.url), 'utf8');
    await connection.query(sql);
  }
  console.log('Cart size schema is ready.');
} finally {
  await connection.end();
}
