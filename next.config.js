/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,
  swcMinify: true,

  experimental: {
    appDir: true,
  },

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
};

module.exports = nextConfig;
