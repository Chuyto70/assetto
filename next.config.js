/* eslint-disable @typescript-eslint/no-var-requires */
const { DefinePlugin } = require('webpack');
/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: true,

  // Domain whitelist
  images: {
    domains: process.env.IMAGES_DOMAINS?.split(', '),
    deviceSizes: [475, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // SVGR
  webpack(config, { nextRuntime }) {
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

    if (nextRuntime === 'edge') {
      config.plugins.push(
        new DefinePlugin({
          'process.env.NEXT_PUBLIC_STRAPI_URL': `"${process.env.NEXT_PUBLIC_STRAPI_URL}"`,
          'process.env.STRAPI_API_TOKEN': `"${process.env.STRAPI_API_TOKEN}"`,
        })
      )
    }

    return config;
  },
  experimental: {
    serverActions: true,
  },
  output: 'standalone',
};

module.exports = withBundleAnalyzer(nextConfig);
