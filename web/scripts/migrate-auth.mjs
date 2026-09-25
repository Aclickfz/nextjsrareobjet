import fs from 'node:fs/promises';
import mysql from 'mysql2/promise';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'justaclick', connectTimeout: 8000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});
try {
  const [columns] = await connection.query('SHOW COLUMNS FROM users');
  if (!columns.some(column => column.Field === 'email_verified_at')) {
    await connection.query('ALTER TABLE users ADD COLUMN email_verified_at DATETIME NULL');
  }
  if (!columns.some(column => column.Field === 'session_version')) {
    await connection.query('ALTER TABLE users ADD COLUMN session_version INT NOT NULL DEFAULT 0');
  }
  const sql = await fs.readFile(new URL('../sql/auth-migration.sql', import.meta.url), 'utf8');
  for (const statement of sql.slice(sql.indexOf('CREATE TABLE')).split(';').filter(value => value.trim())) {
    await connection.query(statement);
  }
  console.log('Authentication schema is ready. Email verification is required before sign-in.');
} finally { await connection.end(); }
