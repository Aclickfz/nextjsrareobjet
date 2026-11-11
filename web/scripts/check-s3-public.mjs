import fs from 'node:fs';
import { S3Client, ListObjectsV2Command, GetPublicAccessBlockCommand } from '@aws-sdk/client-s3';

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

const list = await client.send(new ListObjectsV2Command({ Bucket: env.AWS_S3_BUCKET, MaxKeys: 20 }));
console.log('objects', (list.Contents || []).map((o) => o.Key));
try {
  const pab = await client.send(new GetPublicAccessBlockCommand({ Bucket: env.AWS_S3_BUCKET }));
  console.log('PublicAccessBlock', pab.PublicAccessBlockConfiguration);
} catch (error) {
  console.log('PublicAccessBlock', error.name, error.message);
}

for (const obj of (list.Contents || []).filter((o) => !o.Key.endsWith('/')).slice(0, 5)) {
  const url = `${env.NEXT_PUBLIC_MEDIA_BASE_URL.replace(/\/$/, '')}/${obj.Key}`;
  const res = await fetch(url, { method: 'HEAD' });
  console.log(res.status, url);
}
