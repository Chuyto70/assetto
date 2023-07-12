import { QueryPageFromSlug } from '@/lib/graphql';

import notFound from '@/app/[lang]/not-found';

export default async function Page({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}) {
  const { data } = await QueryPageFromSlug(lang, slug);

  if (data.length <= 0) return notFound({ lang, slug });

  const pageID = data[0].id;
  const { title, content } = data[0].attributes;

  return (
    <>
      <h1 className='text-5xl font-bold uppercase'>{title}</h1>
      {/* <Sections sections={content} pageID={pageID} /> */}
    </>
  );
}
