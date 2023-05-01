import { notFound } from 'next/navigation';

import { graphQLPageProps, QueryAllPagesPaths, QueryPage } from '@/lib/graphql';

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

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div>
        <h1 className='text-5xl font-bold uppercase '>
          {data[0].attributes.title}
        </h1>
      </div>
    </main>
  );
}

// export const dynamicParams = false; //! Temporary to test existing pages, should be dynamic in production in case a page is added after server render
