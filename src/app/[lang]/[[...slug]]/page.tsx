import { graphQLPageProps, QueryPage } from '@/lib/graphql';

import Sections from '@/components/sections';

import notFound from '@/app/[lang]/not-found';

export default async function Page({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}) {
  type PageData = Pick<graphQLPageProps['pages'], 'data'>;
  const { data }: PageData = await QueryPage(lang, slug);

  if (data.length <= 0) return notFound({ lang, slug });

  const pageID = data[0].id;
  const { title, content } = data[0].attributes;

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-4 md:p-8'>
      <div>
        <h1 className='text-5xl font-bold uppercase '>{title}</h1>
        <Sections sections={content} pageID={pageID} locale={lang} />
      </div>
    </main>
  );
}

// export const dynamicParams = false; //! Temporary to test existing pages, should be dynamic in production in case a page is added after server render
