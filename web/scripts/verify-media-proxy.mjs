/**
 * Verifies IAM can GetObject for real DB keys (same as /api/media will do).
 */
import fs from 'node:fs';
import mysql from 'mysql2/promise';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#') && line.includes('='))
    .map((line) => {
      const i = line.indexOf('=');
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  }
});

const conn = await mysql.createConnection({
  host: env.DB_HOST,
  port: Number(env.DB_PORT || 3306),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME
});

const [media] = await conn.query(
  `SELECT path FROM site_media WHERE path LIKE 'banner/%' LIMIT 3`
);
const [products] = await conn.query(
  `SELECT path FROM product_images WHERE path LIKE 'products/%' LIMIT 3`
);
await conn.end();

const keys = [...media, ...products].map((row) => row.path);
console.log('Testing keys:', keys);

for (const key of keys) {
  try {
    const obj = await client.send(new GetObjectCommand({ Bucket: env.AWS_S3_BUCKET, Key: key }));
    const bytes = await obj.Body.transformToByteArray();
    console.log('OK', key, bytes.length, 'bytes', obj.ContentType);
  } catch (error) {
    console.log('FAIL', key, error.name, error.message);
  }
}
