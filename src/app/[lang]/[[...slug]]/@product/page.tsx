import Link from 'next/link';

import { QueryProductFromSlug } from '@/lib/graphql';

import { AddToCartBtn } from '@/components/elements/buttons/AddToCartBtn';

const ProductPage = async ({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}) => {
  const { data } = await QueryProductFromSlug(lang, slug);
  const { title, categories } = data[0].attributes;
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-4 md:p-8'>
      <div>
        {categories && (
          <h2>
            {categories.data.map((cat, index) => (
              <span key={`${cat.attributes.slug}-${index}`}>
                <Link href={`/${lang}/${cat.attributes.slug}`}>
                  {cat.attributes.title}
                </Link>
                {index < categories.data.length - 1 && ' - '}
              </span>
            ))}
          </h2>
        )}
        <h1>{title}</h1>
        <AddToCartBtn product={data[0]} />
      </div>
    </main>
  );
};

export default ProductPage;
