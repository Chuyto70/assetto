import style from './SelectedList.module.css';

import { gql, StrapiClient } from '@/lib/graphql';

import SingleProductCard from '@/components/elements/SingleProductCard';

type ComponentSectionsProductSelectedList = {
  page: {
    data: {
      attributes: {
        content: [
          {
            Filters: string;
            products: {
              data: [
                {
                  id: number;
                }
              ];
            };
          }
        ];
      };
    };
  };
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
  const queryVariables = {
    pageID: pageID,
    locale: locale,
  };

  const fragment = gql`
    fragment sectionsProductSelectedList on ComponentSectionsProductSelectedList {
      Filters
      products {
        data {
          id
        }
      }
    }
  `;

  const { page } =
    await StrapiClient.request<ComponentSectionsProductSelectedList>(
      gql`
        query ProductSelectedList($pageID: ID!, $locale: I18NLocaleCode!) {
          page(id: $pageID, locale: $locale) {
            data {
              attributes {
                content {
                  ...sectionsProductSelectedList
                }
              }
            }
          }
        }
        ${fragment}
      `,
      queryVariables
    );

  const content = page.data.attributes.content[index];

  return (
    <ul className={style.products}>
      {content.products.data.map((product, index) => (
        <li key={index}>
          <SingleProductCard
            locale={locale}
            productID={product.id}
            options={{ colors: true, short_description: true }}
          />
        </li>
      ))}
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
}) => JSX.Element); //This fix the type error because typescript doesn't understand Promise<JSX>
