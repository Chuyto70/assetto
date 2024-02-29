/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: true,

  // Domain whitelist
  images: {
    domains: ["strapi.assettohosting.com", "127.0.0.1", "af27-186-14-197-102.ngrok-free.app"],
    deviceSizes: [475, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

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
    // for next 14
    // serverActions: {
    //   allowedOrigins: [
    //     'localhost',
    //     'localhost:3000',
    //     `${process.env.DEPLOYMENT_PORT ? `${process.env.DEPLOYMENT_HOST}:${process.env.DEPLOYMENT_PORT}` : process.env.DEPLOYMENT_HOST}`,
    //     `*.${process.env.DEPLOYMENT_PORT ? `${process.env.DEPLOYMENT_HOST}:${process.env.DEPLOYMENT_PORT}` : process.env.DEPLOYMENT_HOST}`,
    //   ]
    // },
  },

  output: 'standalone',
};

if (process.env.NODE_ENV === 'development') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.BUNDLE_ANALYZE === 'true',
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
