import { MetadataRoute } from 'next';

import { QueryAllPaths } from '@/lib/graphql';
import { paginateQuery } from '@/lib/helper';
import { Article, Category, Media, Page, Product } from '@/lib/interfaces';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await paginateQuery(QueryAllPaths);
  
  function mapData(dataArray: (Product | Category | Page | Media | Article)[], changeFrequency?: "weekly" | "yearly" | "always" | "hourly" | "daily" | "monthly" | "never", priority = 0.5, staticPath?: string ) {
    return dataArray.map(({ attributes: { slug, locale, updatedAt } }) => {
      slug = slug === "/" ? "" : slug;
      return {
        url: `${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}/${locale}${staticPath ? `/${staticPath}` : ''}/${slug}`.replace(/\/$/, ''),
        lastModified: updatedAt,
        changeFrequency,
        priority,
      };
    });
  }

  return [
    ...mapData(data.pages.data, "weekly", 1),
    ...mapData(data.categories.data, "weekly", 1),
    ...mapData(data.articles.data, "monthly", 0.9, "article"),
    ...mapData(data.medias.data, "monthly", 0.5, "media"),
  ]
}

export const runtime = 'edge';