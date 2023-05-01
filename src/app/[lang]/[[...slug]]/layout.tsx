import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

import '@/assets/styles/globals.css';

const rachana = localFont({
  variable: '--font-rachana',
  src: [
    {
      path: '../../../assets/fonts/Rachana-Regular.ttf',
      weight: '400',
    },
    {
      path: '../../../assets/fonts/Rachana-Regular.woff2',
      weight: '400',
    },
    {
      path: '../../../assets/fonts/Rachana-Bold.ttf',
      weight: '700',
    },
    {
      path: '../../../assets/fonts/Rachana-Bold.woff2',
      weight: '700',
    },
  ],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// TODO: Add SEO generation from slug

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
      className={`${rachana.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
