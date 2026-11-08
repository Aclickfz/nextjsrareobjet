import fs from 'node:fs/promises';
import path from 'node:path';
import nextEnv from '@next/env';
import { HeadBucketCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');

const region = process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim() || 'ap-south-1';
const bucket = process.env.AWS_S3_BUCKET?.trim();
const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();
const publicBase = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || process.env.AWS_S3_PUBLIC_URL || '').replace(/\/$/, '');

if (!bucket || !accessKeyId || !secretAccessKey) {
  console.error('Missing AWS_S3_BUCKET / AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY in web/.env');
  process.exit(1);
}

const client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey }
});

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4'
};

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

async function uploadFile(absolute, key) {
  const ext = path.extname(absolute).toLowerCase();
  const body = await fs.readFile(absolute);
  const normalized = key.replace(/\\/g, '/');
  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: normalized,
    Body: body,
    ContentType: CONTENT_TYPES[ext] || 'application/octet-stream',
    CacheControl: 'public, max-age=31536000, immutable'
  }));
  return publicBase
    ? `${publicBase}/${normalized}`
    : `https://${bucket}.s3.${region}.amazonaws.com/${normalized}`;
}

async function migrateFolder(relativeRoot) {
  const absoluteRoot = path.join(process.cwd(), 'public', relativeRoot);
  try {
    await fs.access(absoluteRoot);
  } catch {
    console.log(`Skip missing folder: public/${relativeRoot}`);
    return 0;
  }
  const files = await walk(absoluteRoot);
  let count = 0;
  for (const file of files) {
    const key = path.relative(path.join(process.cwd(), 'public'), file).replace(/\\/g, '/');
    process.stdout.write(`Uploading ${key} ... `);
    await uploadFile(file, key);
    console.log('ok');
    count += 1;
  }
  return count;
}

try {
  await client.send(new HeadBucketCommand({ Bucket: bucket }));
} catch (error) {
  console.error(`Cannot access bucket "${bucket}":`, error.message || error);
  process.exit(1);
}

console.log(`Migrating images to s3://${bucket} (${region})`);
const homepage = await migrateFolder('assets/images');
const products = await migrateFolder('uploads/products');
const categories = await migrateFolder('uploads/categories');
console.log(`Done. Uploaded homepage=${homepage}, products=${products}, categories=${categories}`);
console.log('Set NEXT_PUBLIC_MEDIA_BASE_URL to your bucket/CloudFront URL, then rebuild.');
if (publicBase) console.log(`Public base: ${publicBase}`);
else console.log(`Example: NEXT_PUBLIC_MEDIA_BASE_URL=https://${bucket}.s3.${region}.amazonaws.com`);
