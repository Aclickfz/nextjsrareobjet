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
  const [columns] = await connection.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'option_groups'`
  );
  if (!columns.length) {
    console.log('products.option_groups is already removed.');
  } else {
    await connection.query('ALTER TABLE products DROP COLUMN option_groups');
    console.log('Dropped products.option_groups.');
  }
} finally {
  await connection.end();
}
