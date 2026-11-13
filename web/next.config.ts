import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Allow product images up to 50 MB each, plus remaining multipart form fields.
      bodySizeLimit: '200mb'
    },
    // Keep page-data workers low so Hostinger/shared builds do not hit OS thread limits.
    webpackBuildWorker: false,
    cpus: 4
  },
  images: { unoptimized: true },
  poweredByHeader: false
};

export default nextConfig;
