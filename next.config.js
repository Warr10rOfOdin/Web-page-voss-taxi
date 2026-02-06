const withNextIntl = require('next-intl/plugin')(
  // This is the default (also the `src` folder is supported out of the box)
  './i18n/request.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Ensure we're not trying to use Node.js APIs in edge runtime
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Configure headers for CMS admin files
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/html; charset=utf-8',
          },
        ],
      },
      {
        source: '/admin/config.yml',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/yaml; charset=utf-8',
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
