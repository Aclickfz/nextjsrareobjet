import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow several 5 MB product images plus the remaining multipart form fields.
      bodySizeLimit: '50mb'
    },
    // Keep page-data workers low so Hostinger/shared builds do not hit OS thread limits.
    webpackBuildWorker: false,
    cpus: 4
  },
  images: { unoptimized: true },
  poweredByHeader: false
};

export default nextConfig;
