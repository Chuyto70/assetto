import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers'
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
import ProvideSupport from '@/components/ProvideSupport';
import ThemesProvider from '@/components/ThemesProvider';
import { ZustandProvider } from '@/components/ZustandProvider';

import { ServerState, useServer } from '@/store/serverStore';

const GoogleTag = dynamic(() => import('@/components/GoogleTag'), { ssr: false });

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

export default async function BaseLayout(props: {
  children: ReactNode,
  modal: ReactNode,
  params: { lang: string },
}) {

  const { google_tag_id, provide_support_script } = await QuerySettings(props.params.lang);
  const { translations } = await QueryStaticTexts(props.params.lang);
  const { i18NLocales } = await Queryi18NLocales();
  const currency = cookies().get('preferred_currency')?.value;

  const state: Partial<ServerState> = {
    locale: props.params.lang,
    locales: i18NLocales.data,
    translations: translations,
  };

  if (currency) state.currency = currency.toUpperCase();

  useServer.setState(state);

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
        {provide_support_script && <ProvideSupport script={provide_support_script} />}
        {google_tag_id && <GoogleTag gtmId={google_tag_id} />}
        <ZustandProvider serverState={useServer.getState()} />
        <ThemesProvider>
          <Header />
          <Toasts />
          <main className='flex flex-col flex-auto items-center py-12 gap-12 md:gap-24 bg-white/40 dark:bg-carbon-900/60 backdrop-blur-200 text-carbon-900 dark:text-white'>{props.children}</main>
          <Footer />
        </ThemesProvider>
        {props.modal}
      </body>
    </html>
  );
}
