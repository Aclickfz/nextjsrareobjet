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
  const sql = await fs.readFile(new URL('../sql/support-queries-migration.sql', import.meta.url), 'utf8');
  await connection.query(sql);

  const [columns] = await connection.query('SHOW COLUMNS FROM support_queries');
  const fields = columns.map((column) => column.Field);
  if (fields.includes('order_number') && !fields.includes('query_type')) {
    await connection.query('ALTER TABLE support_queries CHANGE COLUMN order_number query_type VARCHAR(80) NULL');
    console.log('Renamed order_number to query_type.');
  } else if (!fields.includes('query_type')) {
    await connection.query('ALTER TABLE support_queries ADD COLUMN query_type VARCHAR(80) NULL AFTER phone');
    console.log('Added query_type column.');
  }

  console.log('Support queries schema is ready.');
} finally {
  await connection.end();
}
