import { gql, GraphQLClient } from 'graphql-request';

const API_URL = process.env.strapiURL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export { gql } from 'graphql-request';

export const StrapiClient = new GraphQLClient(`${API_URL}/graphql` as string, {
  headers: {
    authorization: STRAPI_TOKEN ? `Bearer ${STRAPI_TOKEN}` : '',
  },
  fetch: fetch,
});

type graphQLPathsProps = {
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

/**
 * Query all pages paths from Strapi
 * @returns list of pages including languages and paths
 */
export const QueryAllPagesPaths = async () => {
  const { pages } = await StrapiClient.request<graphQLPathsProps>(
    gql`
      query Paths {
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

  return pages;
};

export type graphQLPageProps = {
  pages: {
    data: [
      {
        id: number;
        attributes: {
          title: string;
          slug: string;
          content: [];
          metadata: {
            template_title?: string;
            title_suffix?: string;
            meta_description?: string;
          };
          updatedAt: Date;
          localizations: {
            data: [
              {
                attributes: {
                  locales: string;
                  slug: string;
                };
              }
            ];
          };
        };
      }
    ];
  };
};

/**
 * Query a single page from Strapi
 * @param locale language of the requested page
 * @param slug array of slugs
 * @returns data of a page with direct content
 */
export const QueryPage = async (locale: string, slug: string[] | undefined) => {
  const joinedSlug = !slug
    ? '/'
    : slug instanceof Array
    ? slug.join('/')
    : Array.of(slug).join('/');

  const queryVariables = {
    locale: locale,
    joinedSlug: joinedSlug,
  };

  const { pages } = await StrapiClient.request<graphQLPageProps>(
    gql`
      query Pages($locale: I18NLocaleCode!, $joinedSlug: String!) {
        pages(
          filters: { slug: { eq: $joinedSlug } }
          locale: $locale
          pagination: { limit: 1 }
        ) {
          data {
            id
            attributes {
              title
              slug

              content {
                __typename
              }

              metadata {
                template_title
                title_suffix
                meta_description
              }

              updatedAt

              localizations {
                data {
                  attributes {
                    locale
                    slug
                  }
                }
              }
            }
          }
        }
      }
    `,
    queryVariables
  );

  return pages;
};

export type graphQLProductProps = {
  product: {
    data: {
      attributes: {
        title: string;
        slug: string;
        price: string;
        sale_price?: number;
        date_on_sale_from?: string;
        date_on_sale_to?: string;
        medias: {
          data: [
            {
              attributes: {
                alternativeText: string;
                url: string;
                width: number;
                height: number;
                mime: string;
              };
            }
          ];
        };
      };
    };
  };
};

/**
 * Query a single product from Strapi
 * @param locale language of the requested page
 * @param id id of the product
 * @returns data of a product
 */
export const QueryProduct = async (locale: string, id: number) => {
  const queryVariables = {
    locale: locale,
    id: id,
  };

  const { product } = await StrapiClient.request<graphQLProductProps>(
    gql`
      query Product($id: ID!, $locale: I18NLocaleCode) {
        product(id: $id, locale: $locale) {
          data {
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
                    url
                    width
                    height
                    mime
                  }
                }
              }
            }
          }
        }
      }
    `,
    queryVariables
  );

  return product.data.attributes;
};
