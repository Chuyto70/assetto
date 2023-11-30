import { MetadataRoute } from 'next';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api', '/_next'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/sitemap.xml`,
  }
}