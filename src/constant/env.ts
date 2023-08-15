export const isProd = global.process.env.NODE_ENV === 'production';
export const isLocal = global.process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : global.process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

export const deploymentURL = global.process.env.NEXT_PUBLIC_DEPLOYMENT_URL
  ? `${global.process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`
  : global.process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${global.process.env.NEXT_PUBLIC_VERCEL_URL}`
  : 'http://localhost:3000';

export const defaultLocale = global.process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? 'fr';
