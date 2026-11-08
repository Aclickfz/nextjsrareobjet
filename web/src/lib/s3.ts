import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

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

export async function uploadToS3(key: string, body: Buffer, contentType: string) {
  const clean = key.replace(/^\/+/, '');
  await client().send(new PutObjectCommand({
    Bucket: bucket(),
    Key: clean,
    Body: body,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable'
  }));
  return s3ObjectUrl(clean);
}

export async function deleteFromS3(keyOrUrl: string) {
  const key = keyOrUrl
    .replace(/^https?:\/\/[^/]+\//i, '')
    .replace(/^\/+/, '');
  if (!key.startsWith('uploads/') && !key.startsWith('assets/')) return;
  await client().send(new DeleteObjectCommand({
    Bucket: bucket(),
    Key: key
  }));
}
