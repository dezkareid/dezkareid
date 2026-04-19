import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
];

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
    rootParams: true,
  },
  cacheComponents: true,
  cacheLife: {
    // User-generated content pages: profile, collection, item detail.
    // Primary freshness mechanism is on-demand revalidation via revalidateTag()
    // after owner mutations — TTL expiry is the safety net only.
    'user-content': {
      stale: 60 * 60 * 24, // 24h — serve stale while revalidating
      revalidate: 60 * 60 * 24, // 24h — background revalidation interval
      expire: 60 * 60 * 24 * 7, // 7d — hard expiry
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
