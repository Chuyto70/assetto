import { Inter, Noto_Sans_Display } from 'next/font/google';

import '@/assets/styles/globals.css';

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
      className={`${noto_sans_display.variable} ${inter.variable}`}
    >
      <body className='text-dark'>{children}</body>
    </html>
  );
}
