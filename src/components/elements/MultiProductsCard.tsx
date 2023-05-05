import { graphQLProductProps } from '@/lib/graphql';

import SingleProductCard from '@/components/elements/SingleProductCard';

export default function MultiProductsCard({
  locale,
  products,
  imgSizes,
}: {
  locale: string;
  products: graphQLProductProps[];
  imgSizes?: string;
}) {
  return (
    <>
      {products.map((product, index) => (
        <SingleProductCard
          key={index}
          locale={locale}
          product={product}
          imgSizes={imgSizes}
        />
      ))}
    </>
  );
}
