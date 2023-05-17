import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { Inter, Noto_Sans_Display } from 'next/font/google';

import '@/assets/styles/globals.css';

import { QuerySettings } from '@/lib/graphql';
import { MediaUrl } from '@/lib/helper';
import { seo } from '@/lib/seo';

import Header from '@/components/layout/Header';

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
  params: { lang },
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const { favicons, seo: defaultSeo } = await QuerySettings(lang);
  const iconList: Icon[] = [];
  favicons.data.forEach((icon) => {
    return iconList.push(MediaUrl(icon.attributes.url));
  });

  const metadata = seo({
    ...defaultSeo,
    lang: lang,
    icons: iconList,
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
      <body className='text-dark'>
        <Header />
        {children}
      </body>
    </html>
  );
}
