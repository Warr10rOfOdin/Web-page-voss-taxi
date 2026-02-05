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
};

module.exports = withNextIntl(nextConfig);
