import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow several 5 MB product images plus the remaining multipart form fields.
      bodySizeLimit: '50mb'
    }
  },
  images: { unoptimized: true },
  poweredByHeader: false
};

export default nextConfig;
