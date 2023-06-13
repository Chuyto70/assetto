import { gql, QueryContentComponent, QueryProduct } from '@/lib/graphql';
import { Product } from '@/lib/interfaces';

import MultiProductsCard from '@/components/elements/cards/MultiProductsCard';
import SingleProductCard from '@/components/elements/cards/SingleProductCard';

import { useServer } from '@/store/serverStore';

type ColorProducts = {
  [id: number]: Product[];
};

const buildColorProducts = async (products: {
  data: Product[];
}): Promise<ColorProducts> => {
  const colorProducts: ColorProducts = {};

  const queries = products.data.flatMap((product) => {
    if (product.attributes.colors && product.attributes.colors.length > 0) {
      return product.attributes.colors
        .filter((color) => color.product.data.id !== product.id)
        .map((color) => QueryProduct(color.product.data.id));
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

const ComponentSectionsProductSelectedList = gql`
  fragment sectionsProductSelectedList on ComponentSectionsProductSelectedList {
    filters
    products {
      data {
        id
        attributes {
          title
          slug
          price
          sale_price
          date_on_sale_from
          date_on_sale_to
          medias {
            data {
              attributes {
                alternativeText
                name
                url
                width
                height
                mime
              }
            }
          }

          colors {
            color
            product {
              data {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export default (async function SelectedList({
  pageID,
  index,
}: {
  pageID: number;
  index: number;
}) {
  type dataType = {
    page: {
      data: {
        attributes: {
          content: {
            Filters: boolean;
            products: {
              data: Product[];
            };
          }[];
        };
      };
    };
  };
  const locale = useServer.getState().locale;
  const { page }: dataType = await QueryContentComponent(
    locale,
    pageID,
    'page',
    ComponentSectionsProductSelectedList,
    'sectionsProductSelectedList'
  );
  const { products } = page.data.attributes.content[index];

  const productsWithColor = await buildColorProducts(products);

  return (
    <ul className='max-w-screen-3xl xs:grid-cols-2 grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-8 lg:grid-cols-4 xl:grid-cols-5'>
      {products.data.map((product, index) => {
        const colorProducts = productsWithColor[product.id] || [];
        const productsList = [product, ...colorProducts];
        return (
          <li key={index}>
            {(productsList.length > 1 && (
              <MultiProductsCard
                products={productsList}
                imgSizes='(max-width: 475px) 100vh, 80vh'
              />
            )) || (
              <SingleProductCard
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
  pageID,
  index,
}: {
  pageID: number;
  index: number;
}) => JSX.Element);
