import Link from 'next/link';

import { gql, StrapiClient } from '@/lib/graphql';

type graphQLPageProps = {
  pages: {
    data: [
      {
        attributes: {
          slug: string;
          locale: string;
        };
      }
    ];
  };
};

async function GetStaticPaths() {
  const { pages } = await StrapiClient.request<graphQLPageProps>(
    gql`
      query {
        pages(publicationState: LIVE, locale: "all") {
          data {
            attributes {
              locale
              slug
            }
          }
        }
      }
    `
  );

  const paths = pages.data.map((page) => {
    const { slug, locale } = page.attributes;
    // Decompose the slug that was saved in Strapi
    const slugArray = !slug ? false : slug.split('/').filter((s) => s !== '');
    return {
      lang: locale,
      slug: slugArray,
    };
  });

  return paths;
}

export async function generateStaticParams() {
  const params = await GetStaticPaths();
  return params;
}

export default function Page({
  params: { lang, slug },
}: {
  params: { slug: string; lang: string };
}) {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div>
        <Link href='/'>Homepage</Link>
        <p>Langue : {lang}</p>
        <p>slugs : {slug}</p>
      </div>
    </main>
  );
}

export const dynamicParams = false; //! Temporary to test existing pages, should be dynamic in production in case a page is added after server render
