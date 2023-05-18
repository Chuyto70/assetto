import { QueryPageFromSlug } from '@/lib/graphql';

import Sections from '@/components/sections';

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
    <main className='flex min-h-screen flex-col items-center justify-between p-4 md:p-8'>
      <div>
        <h1 className='text-5xl font-bold uppercase '>{title}</h1>
        <Sections sections={content} pageID={pageID} />
      </div>
    </main>
  );
}
