import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';

import { seo } from '@/lib/seo';

import { urlRegex } from '@/constant/utils';

export async function generateMetadata(): Promise<Metadata> {
	
	const header_url = headers().get('x-url') || '';
	const [, , path = ''] = header_url.match(urlRegex)?.slice(1) ?? [];

	const metadata = seo(
		{
			templateTitle: 'Accueil',
			description: 'description de la page d\'accueil',
			path: path
		}
	);
	return metadata;
}

export default function Page() {
	return <>
	  <main>
			<h1>Main page</h1>
			<Link href='/blog/test'>Vers /blog</Link>
	  </main>
  </>;
}