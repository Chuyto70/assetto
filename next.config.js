/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE,
});

const nextConfig = {
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: true,

  env: {
    strapiURL: process.env.STRAPI_URL,
  },

  // Domain whitelist
  images: {
    domains: process.env.IMAGES_DOMAINS?.split(', '),
    deviceSizes: [475, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // Uncoment to add domain whitelist
  // images: {
  //   domains: [
  //     'res.cloudinary.com',
  //   ],
  // },

  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
