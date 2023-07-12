import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

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
import ThemesProvider from '@/components/ThemesProvider';
import { ZustandProvider } from '@/components/ZustandProvider';

import { useServer } from '@/store/serverStore';

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
    default_currency,
    currencies
  } = await QuerySettings(lang);
  const iconList: Icon[] = [];
  useServer.setState({ paymentProvider: payment_provider as PAYMENT_PROVIDER, currency: default_currency, currencies });
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

export default async function RootLayout(props: {
  children: ReactNode,
  modal: ReactNode,
  params: { lang: string },
}) {
  const { translations } = await QueryStaticTexts(props.params.lang);
  const { i18NLocales } = await Queryi18NLocales();
  useServer.setState({
    locale: props.params.lang,
    locales: i18NLocales.data,
    translations: translations,
  });

  return (
    <html
      lang={props.params.lang ?? 'fr'}
      className={`${inter.variable}`}
      suppressHydrationWarning
    >
      <body className='relative bg-white dark:bg-carbon-900 text-carbon-900 min-h-screen flex flex-col'>
        <span className='-z-10 absolute w-full h-screen overflow-hidden'>
          <span className='absolute top-0 -left-10 rounded-full bg-secondary-600 w-60 h-60'></span>
          <span className='absolute bottom-1/4 -right-10 rounded-full bg-primary-600 w-60 h-60'></span>
        </span>
        <ZustandProvider serverState={useServer.getState()} />
        <ThemesProvider>
          <Header />
          <Toasts />
          <main className='flex flex-col flex-auto items-center bg-white/40 dark:bg-carbon-900/60 backdrop-blur-200 text-carbon-900 dark:text-white'>{props.children}</main>
          <Footer />
        </ThemesProvider>
        {props.modal}
      </body>
    </html>
  );
}
