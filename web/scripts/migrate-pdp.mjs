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
  const sql = await fs.readFile(new URL('../sql/pdp-migration.sql', import.meta.url), 'utf8');
  const statements = sql
    .split(';')
    .map((part) =>
      part
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('--'))
        .join(' ')
        .trim()
    )
    .filter(Boolean);

  for (const statement of statements) {
    try {
      await connection.query(statement);
      console.log('OK:', statement.slice(0, 72).replace(/\s+/g, ' '), '...');
    } catch (error) {
      if (error?.code === 'ER_DUP_FIELDNAME') {
        console.log('Skip existing column:', statement.match(/ADD COLUMN (\w+)/)?.[1]);
        continue;
      }
      throw error;
    }
  }
  console.log('PDP product columns are ready.');
} finally {
  await connection.end();
}
