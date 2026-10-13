import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow a 5 MB product image plus the remaining multipart form fields.
      bodySizeLimit: '10mb'
    }
  },
  images: { unoptimized: true },
  poweredByHeader: false
};

export default nextConfig;
