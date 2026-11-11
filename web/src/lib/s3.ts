import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

export function s3Configured() {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID?.trim()
    && process.env.AWS_SECRET_ACCESS_KEY?.trim()
    && process.env.AWS_S3_BUCKET?.trim()
    && (process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim())
  );
}

export function mediaBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim()
    || process.env.AWS_S3_PUBLIC_URL?.trim()
    || ''
  ).replace(/\/$/, '');
}

/** Keys the app may serve via /api/media or delete from S3. */
export function isManagedMediaKey(key: string) {
  return /^(products|category|banner|assets|uploads|orders)\//.test(key);
}

function region() {
  return process.env.AWS_REGION?.trim() || process.env.AWS_DEFAULT_REGION?.trim() || 'ap-south-1';
}

function bucket() {
  return required('AWS_S3_BUCKET');
}

function client() {
  return new S3Client({
    region: region(),
    credentials: {
      accessKeyId: required('AWS_ACCESS_KEY_ID'),
      secretAccessKey: required('AWS_SECRET_ACCESS_KEY')
    }
  });
}

export function s3ObjectUrl(key: string) {
  const clean = key.replace(/^\/+/, '');
  const base = mediaBaseUrl();
  if (base) return `${base}/${clean}`;
  return `https://${bucket()}.s3.${region()}.amazonaws.com/${clean}`;
}

export async function uploadToS3(
  key: string,
  body: Buffer,
  contentType: string,
  cacheControl = 'public, max-age=31536000, immutable'
) {
  const clean = key.replace(/^\/+/, '');
  await client().send(new PutObjectCommand({
    Bucket: bucket(),
    Key: clean,
    Body: body,
    ContentType: contentType,
    CacheControl: cacheControl
  }));
  return s3ObjectUrl(clean);
}

export async function deleteFromS3(keyOrUrl: string) {
  const key = keyOrUrl
    .replace(/^https?:\/\/[^/]+\//i, '')
    .replace(/^\/+/, '');
  if (!isManagedMediaKey(key)) return;
  await client().send(new DeleteObjectCommand({
    Bucket: bucket(),
    Key: key
  }));
}

export async function getS3Object(key: string) {
  const clean = key.replace(/^\/+/, '');
  if (!isManagedMediaKey(clean)) throw new Error('Invalid media key');
  const result = await client().send(new GetObjectCommand({
    Bucket: bucket(),
    Key: clean
  }));
  if (!result.Body) throw new Error('Empty S3 object');
  return {
    body: result.Body,
    contentType: result.ContentType || 'application/octet-stream',
    cacheControl: result.CacheControl || 'public, max-age=31536000, immutable',
    contentLength: result.ContentLength
  };
}

/** Stable key for a customer's order confirmation HTML archive. */
export function orderConfirmationS3Key(userId: number, orderId: number) {
  return `orders/user-${userId}/order-${orderId}/confirmation.html`;
}
