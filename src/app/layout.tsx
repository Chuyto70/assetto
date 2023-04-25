import { Metadata } from 'next';
import { headers } from 'next/headers';

import '@/assets/styles/globals.css';

import { seo } from '@/lib/seo';

import { urlRegex } from '@/constant/utils';

export async function generateMetadata(): Promise<Metadata> {

	const header_url = headers().get('x-url') || '';
	const [, , path = ''] = header_url.match(urlRegex)?.slice(1) ?? [];
	
	const metadata = seo(
		{
			path: path
		}
	);
	return metadata;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  return (
    <html>
      <head>
        <link
          rel='preload'
          href='/fonts/inter-var-latin.woff2'
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
