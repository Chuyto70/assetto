import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { seo } from "@/lib/seo";

import { urlRegex } from "@/constant/utils";

export async function generateMetadata(): Promise<Metadata> {

	const header_url = headers().get('x-url') || '';
	const [, , path = ''] = header_url.match(urlRegex)?.slice(1) ?? [];

	const metadata = seo(
		{
			templateTitle: 'Page introuvable',
			description: 'La page demandée ne peut pas être trouvée. Erreur 404',
			path: path
		}
	);
	return metadata;
}

export default function NotFoundCatchAll() {
  notFound()
}