import style from './SelectedList.module.css';

import {
  graphQLProductProps,
  graphQLProductsProps,
  QueryProduct,
  QueryProductSelectedList,
} from '@/lib/graphql';

import MultiProductsCard from '@/components/elements/MultiProductsCard';
import SingleProductCard from '@/components/elements/SingleProductCard';

type ColorProducts = {
  [id: number]: graphQLProductProps[];
};

const buildColorProducts = async (
  locale: string,
  products: graphQLProductsProps
): Promise<ColorProducts> => {
  const colorProducts: ColorProducts = {};

  const queries = products.data.flatMap((product) => {
    if (product.attributes.colors && product.attributes.colors.length > 0) {
      return product.attributes.colors
        .filter((color) => color.product.data.id !== product.id)
        .map((color) =>
          QueryProduct(locale, color.product.data.id, { colors: true })
        );
    }
    return [];
  });

  const results = await Promise.all(queries);

  results.forEach((product, index) => {
    const baseId = products.data[index].id;
    const colorProduct = {
      ...product.data,
    };
    if (!colorProducts[baseId]) {
      colorProducts[baseId] = [];
    }
    colorProducts[baseId].push(colorProduct);
  });

  return colorProducts;
};

export default (async function SelectedList({
  locale,
  pageID,
  index,
}: {
  locale: string;
  pageID: number;
  index: number;
}) {
  const { data } = await QueryProductSelectedList(locale, pageID);
  const { products } = data.attributes.content[index];

  const productsWithColor = await buildColorProducts(locale, products);

  return (
    <ul className={style.products}>
      {products.data.map((product, index) => {
        const colorProducts = productsWithColor[product.id] || [];
        const productsList = [product, ...colorProducts];
        return (
          <li key={index}>
            {(productsList.length > 1 && (
              <MultiProductsCard
                locale={locale}
                products={productsList}
                imgSizes='(max-width: 475px) 100vh, 80vh'
              />
            )) || (
              <SingleProductCard
                locale={locale}
                product={product}
                imgSizes='(max-width: 475px) 100vh, 80vh'
              />
            )}
          </li>
        );
      })}
    </ul>
  );
} as unknown as ({
  locale,
  pageID,
  index,
}: {
  locale: string;
  pageID: number;
  index: number;
}) => JSX.Element);
