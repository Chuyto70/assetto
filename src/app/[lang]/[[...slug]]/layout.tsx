import { formatISO, parseISO } from 'date-fns';
import { Metadata } from 'next';

import {
  graphQLSeoPageProps,
  QueryPageSeo,
  QuerySettings,
} from '@/lib/graphql';
import { seo } from '@/lib/seo';

export async function generateMetadata({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}): Promise<Metadata> {
  type SeoPageData = Pick<graphQLSeoPageProps['pages'], 'data'>;
  const { data }: SeoPageData = await QueryPageSeo(lang, slug);

  if (data.length <= 0) return seo();

  const { seo: defaultSeo } = await QuerySettings(lang);

  const {
    metadata: meta,
    slug: path,
    localizations,
    updatedAt,
  } = data[0].attributes;

  const metadata = seo({
    ...defaultSeo,
    templateTitle: meta.template_title,
    titleSuffix: meta.title_suffix,
    description: meta.meta_description || defaultSeo.description,
    path: path,
    date: formatISO(parseISO(updatedAt)),
    localizations: localizations,
  });
  return metadata;
}

export default function SlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
