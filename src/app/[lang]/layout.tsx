import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { Inter, Noto_Sans_Display } from 'next/font/google';

import '@/assets/styles/globals.css';

import {
  Queryi18NLocales,
  QuerySettings,
  QueryStaticTexts,
} from '@/lib/graphql';
import { MediaUrl } from '@/lib/helper';
import { PAYMENT_PROVIDER } from '@/lib/interfaces';
import { seo } from '@/lib/seo';

import Toasts from '@/components/elements/toaster/Toasts';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { ZustandProvider } from '@/components/ZustandProvider';

import { useServer } from '@/store/serverStore';

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
  const {
    favicons,
    seo: defaultSeo,
    payment_provider,
  } = await QuerySettings(lang);
  const iconList: Icon[] = [];
  useServer.setState({ paymentProvider: payment_provider as PAYMENT_PROVIDER });
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

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const { translations } = await QueryStaticTexts(lang);
  const { i18NLocales } = await Queryi18NLocales();
  useServer.setState({
    locale: lang,
    locales: i18NLocales.data,
    translations: translations,
  });

  return (
    <html
      lang={lang ?? 'fr'}
      className={`${noto_sans_display.variable} ${inter.variable}`}
    >
      <body className='text-carbon-900 min-h-screen flex flex-col'>
        <ZustandProvider serverState={useServer.getState()} />
        <Header />
        <Toasts />
        <main className='flex flex-col flex-auto'>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
