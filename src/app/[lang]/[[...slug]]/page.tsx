import { QueryPageFromSlug } from '@/lib/graphql';

import Sections, { sectionTypeProps } from '@/components/sections';

import notFound from '@/app/[lang]/not-found';

export default async function Page({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}) {
  const { data } = await QueryPageFromSlug(lang, slug);

  if (data.length <= 0) return notFound({ lang, slug });

  const pageID = data[0].id;
  const { content } = data[0].attributes;

  return (
    <>
      <Sections sections={content as [sectionTypeProps]} pageID={pageID} />
    </>
  );
}
