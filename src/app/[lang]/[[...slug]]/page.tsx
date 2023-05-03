import { notFound } from 'next/navigation';

import { graphQLPageProps, QueryAllPagesPaths, QueryPage } from '@/lib/graphql';

import Sections from '@/components/sections';

export async function generateStaticParams() {
  const pages = await QueryAllPagesPaths();

  const params = pages.data.map((page) => {
    const { slug, locale } = page.attributes;
    // Decompose the slug that was saved in Strapi
    const slugArray = !slug ? false : slug.split('/').filter((s) => s !== '');
    return {
      lang: locale,
      slug: slugArray,
    };
  });

  return params;
}

export default async function Page({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}) {
  type PageData = Pick<graphQLPageProps['pages'], 'data'>;
  const { data }: PageData = await QueryPage(lang, slug);

  if (data.length <= 0) return notFound();

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
