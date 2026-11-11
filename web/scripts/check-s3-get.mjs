import fs from 'node:fs';
import mysql from 'mysql2/promise';
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

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

const key = 'banner/_proxy-check.txt';
try {
  await client.send(new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET,
    Key: key,
    Body: Buffer.from('ok'),
    ContentType: 'text/plain'
  }));
  console.log('PutObject OK');
} catch (error) {
  console.log('PutObject FAIL', error.name, error.message);
}

try {
  const head = await client.send(new HeadObjectCommand({ Bucket: env.AWS_S3_BUCKET, Key: key }));
  console.log('HeadObject OK', head.ContentLength);
} catch (error) {
  console.log('HeadObject FAIL', error.name, error.message);
}

try {
  const get = await client.send(new GetObjectCommand({ Bucket: env.AWS_S3_BUCKET, Key: key }));
  console.log('GetObject OK', await get.Body.transformToString());
} catch (error) {
  console.log('GetObject FAIL', error.name, error.message);
}

const url = `${env.NEXT_PUBLIC_MEDIA_BASE_URL.replace(/\/$/, '')}/${key}`;
const res = await fetch(url);
console.log('Public GET', res.status, url);

try {
  const conn = await mysql.createConnection({
    host: env.DB_HOST,
    port: Number(env.DB_PORT || 3306),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
  });
  const [rows] = await conn.query(
    `SELECT slot_key, path FROM site_media
     WHERE path LIKE 'banner/%' OR path LIKE 'products/%' OR path LIKE 'category/%'
     ORDER BY updated_at DESC LIMIT 10`
  );
  console.log('DB media paths', rows);
  const [images] = await conn.query(
    `SELECT id, path FROM product_images WHERE path LIKE 'products/%' OR path LIKE 'uploads/%' ORDER BY id DESC LIMIT 5`
  );
  console.log('product_images', images);
  await conn.end();
} catch (error) {
  console.log('DB', error.message);
}
