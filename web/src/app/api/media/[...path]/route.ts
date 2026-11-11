import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { getS3Object, isManagedMediaKey, s3Configured } from '@/lib/s3';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ path: string[] }> };

function contentTypeFor(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const map: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.html': 'text/html; charset=utf-8'
  };
  return map[ext] || 'application/octet-stream';
}

/** Resolve legacy upload prefixes to the rareobjet-media folder layout. */
function candidateKeys(key: string) {
  const keys = [key];
  if (key.startsWith('uploads/products/')) keys.push(key.replace(/^uploads\/products\//, 'products/'));
  if (key.startsWith('uploads/categories/')) keys.push(key.replace(/^uploads\/categories\//, 'category/'));
  if (key.startsWith('uploads/homepage/')) keys.push(key.replace(/^uploads\/homepage\//, 'banner/'));
  if (key.startsWith('products/')) keys.push(`uploads/${key}`);
  if (key.startsWith('category/')) keys.push(key.replace(/^category\//, 'uploads/categories/'));
  if (key.startsWith('banner/')) keys.push(key.replace(/^banner\//, 'uploads/homepage/'));
  return [...new Set(keys)];
}

async function tryS3(key: string) {
  try {
    const object = await getS3Object(key);
    const bytes = await object.body.transformToByteArray();
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        'Content-Type': object.contentType,
        'Cache-Control': object.cacheControl,
        'Content-Length': String(bytes.byteLength)
      }
    });
  } catch {
    // Missing objects often surface as AccessDenied when IAM lacks s3:ListBucket.
    return null;
  }
}

function tryLocal(key: string) {
  const absolute = path.join(process.cwd(), 'public', ...key.split('/'));
  const publicRoot = path.join(process.cwd(), 'public') + path.sep;
  if (!absolute.startsWith(publicRoot) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    return null;
  }
  const buffer = fs.readFileSync(absolute);
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentTypeFor(absolute),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Length': String(buffer.byteLength)
    }
  });
}

export async function GET(_request: Request, { params }: Params) {
  const segments = (await params).path || [];
  const key = segments.map((part) => decodeURIComponent(part)).join('/');
  if (!key || key.includes('..') || !isManagedMediaKey(key)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const keys = candidateKeys(key);

  if (s3Configured()) {
    for (const candidate of keys) {
      const response = await tryS3(candidate);
      if (response) return response;
    }
  }

  for (const candidate of keys) {
    const response = tryLocal(candidate);
    if (response) return response;
  }

  return NextResponse.json({ error: 'Not found', key }, { status: 404 });
}
