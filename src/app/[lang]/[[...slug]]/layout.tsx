import { formatISO, parseISO } from 'date-fns';
import { Metadata } from 'next';
import { Inter, Noto_Sans_Display } from 'next/font/google';

import '@/assets/styles/globals.css';

import { graphQLSeoPageProps, QueryPageSeo } from '@/lib/graphql';
import { seo } from '@/lib/seo';

const noto_sans_display = Noto_Sans_Display({
  subsets: ['latin'],
  variable: '--font-noto-sans-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export async function generateMetadata({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}): Promise<Metadata> {
  type SeoPageData = Pick<graphQLSeoPageProps['pages'], 'data'>;
  const { data }: SeoPageData = await QueryPageSeo(lang, slug);

  if (data.length <= 0) return seo();

  const {
    metadata: meta,
    slug: path,
    localizations,
    updatedAt,
  } = data[0].attributes;

  const metadata = seo({
    templateTitle: meta.template_title,
    titleSuffix: meta.title_suffix,
    description: meta.meta_description,
    path: path,
    date: formatISO(parseISO(updatedAt)),
    localizations: localizations,
  });
  return metadata;
}

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html
      lang={lang ?? 'fr'}
      className={`${noto_sans_display.variable} ${inter.variable}`}
    >
      <body className='text-dark'>{children}</body>
    </html>
  );
}
