import formatISO from "date-fns/formatISO";
import parseISO from "date-fns/parseISO";
import { Metadata } from "next";

import { QueryMediaFromSlug, QuerySettings } from "@/lib/graphql";
import { seo } from "@/lib/seo";

export async function generateMetadata({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}): Promise<Metadata> {
  const { medias } = await QueryMediaFromSlug(lang, ['media', ...slug]);
  const { seo: defaultSeo } = await QuerySettings(lang);

  if (!medias.data.length)
    return seo({ ...defaultSeo });

  const data = medias.data;

  const {
    metadata: meta,
    slug: path,
    localizations,
    updatedAt,
  } = data[0].attributes;

  const metadata = seo({
    ...defaultSeo,
    templateTitle: meta.template_title,
    titleSuffix: meta.title_suffix,
    description: meta.meta_description || defaultSeo.description,
    path: path,
    lang: lang,
    date: formatISO(parseISO(updatedAt)),
    localizations: localizations,
  });
  return metadata;
}

export default async function SlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}