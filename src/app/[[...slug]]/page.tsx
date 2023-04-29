import Link from 'next/link';

import { gql, StrapiClient } from '@/lib/graphql';

export type graphQLPageProps = {
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
    const slugArray = !slug ? false : slug.split('/');
    return {
      params: { slug: slugArray },
      locale,
    };
  });

  return { paths };
}

export async function generateStaticParams() {
  const { paths } = await GetStaticPaths();
  return paths;
}

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div>
        <Link href='/'>Homepage</Link>
        <p>{params.slug}</p>
      </div>
    </main>
  );
}
