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

/**
 * Query settings from Strapi
 * @returns settings data
 */
export const QuerySettings = async (locale: string) => {
  const queryVariables = {
    locale: locale,
  };

  const { setting } = await StrapiClient.request<{
    setting: {
      data: {
        attributes: {
          favicons: {
            data: { attributes: { url: string } }[];
          };
          seo: {
            title: string;
            siteName: string;
            description: string;
          };
        };
      };
    };
  }>(
    gql`
      query Settings($locale: I18NLocaleCode!) {
        setting(locale: $locale) {
          data {
            attributes {
              favicons {
                data {
                  attributes {
                    url
                  }
                }
              }
              seo {
                title
                siteName
                description
              }
            }
          }
        }
      }
    `,
    queryVariables
  );

  return setting.data.attributes;
};

/**
 * Query page or product id from slug
 * @param locale locale language
 * @param slug array of slugs
 * @returns id and slug
 */
export const QueryIdFromSlug = async (
  locale: string,
  slug: string[] | undefined
) => {
  const joinedSlug = !slug
    ? '/'
    : slug instanceof Array
    ? slug.join('/')
    : Array.of(slug).join('/');

  const queryVariables = {
    locale: locale,
    joinedSlug: joinedSlug,
  };

  const data = await StrapiClient.request<{
    pages: {
      data: {
        id: number;
        attributes: {
          slug: string;
        };
      }[];
    };
    products: {
      data: {
        id: number;
        attributes: {
          slug: string;
        };
      }[];
    };
    categories: {
      data: {
        id: number;
        attributes: {
          slug: string;
        };
      }[];
    };
  }>(
    gql`
      query idFromSlug($locale: I18NLocaleCode!, $joinedSlug: String!) {
        pages(
          filters: { slug: { eq: $joinedSlug } }
          locale: $locale
          pagination: { limit: 1 }
        ) {
          data {
            id
            attributes {
              slug
            }
          }
        }

        products(
          filters: { slug: { eq: $joinedSlug } }
          locale: $locale
          pagination: { limit: 1 }
        ) {
          data {
            id
            attributes {
              slug
            }
          }
        }

        categories(
          filters: { slug: { eq: $joinedSlug } }
          locale: $locale
          pagination: { limit: 1 }
        ) {
          data {
            id
            attributes {
              slug
            }
          }
        }
      }
    `,
    queryVariables
  );

  return data;
};

type graphQLPathsProps = {
  pages: {
    data: [
      {
        id: number;
        attributes: {
          slug: string;
          locale: string;
        };
      }
    ];
  };
  products: {
    data: [
      {
        id: number;
        attributes: {
          slug: string;
          locale: string;
        };
      }
    ];
  };
  categories: {
    data: [
      {
        id: number;
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
  const data = await StrapiClient.request<graphQLPathsProps>(
    gql`
      query Paths {
        pages(publicationState: LIVE, locale: "all") {
          data {
            id
            attributes {
              locale
              slug
            }
          }
        }

        products(publicationState: LIVE, locale: "all") {
          data {
            id
            attributes {
              locale
              slug
            }
          }
        }

        categories(locale: "all") {
          data {
            id
            attributes {
              locale
              slug
            }
          }
        }
      }
    `
  );

  return data;
};

export type graphQLSeoPageProps = {
  pages: {
    data: [
      {
        attributes: {
          slug: string;
          metadata: {
            template_title?: string;
            title_suffix?: string;
            meta_description?: string;
          };
          updatedAt: string;
          localizations: {
            data: [
              {
                attributes: {
                  locale: string;
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
 * Query seo of a page from Strapi
 * @param locale language of the requested page
 * @param slug array of slugs
 * @returns seo data of a page with direct content
 */
export const QueryPageSeo = async (
  locale: string,
  slug: string[] | undefined
) => {
  const joinedSlug = !slug
    ? '/'
    : slug instanceof Array
    ? slug.join('/')
    : Array.of(slug).join('/');

  const queryVariables = {
    locale: locale,
    joinedSlug: joinedSlug,
  };

  const { pages } = await StrapiClient.request<graphQLSeoPageProps>(
    gql`
      query PagesSeo($locale: I18NLocaleCode!, $joinedSlug: String!) {
        pages(
          filters: { slug: { eq: $joinedSlug } }
          locale: $locale
          pagination: { limit: 1 }
        ) {
          data {
            attributes {
              slug
              metadata {
                template_title
                title_suffix
                meta_description
              }
              updatedAt
              localizations {
                data {
                  attributes {
                    slug
                    locale
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

export type graphQLPageProps = {
  pages: {
    data: [
      {
        id: number;
        attributes: {
          title: string;
          slug: string;
          content: [];
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
  id: number;
  attributes: {
    title: string;
    slug: string;
    price: number;
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
    short_description?: string;
    colors?: [
      {
        color: string;
        product: {
          data: {
            id: number;
          };
        };
      }
    ];
  };
};

/**
 * Query a single product from Strapi
 * @param locale language of the requested page
 * @param id id of the product
 * @returns data of a product
 */
export const QueryProduct = async (
  locale: string,
  id: number,
  options?: { colors?: boolean; short_description?: boolean }
) => {
  const queryVariables = {
    locale: locale,
    id: id,
  };

  const colorsFragment = gql`
    fragment colors on Product {
      colors {
        color
        product {
          data {
            id
          }
        }
      }
    }
  `;

  const { product } = await StrapiClient.request<{
    product: { data: graphQLProductProps };
  }>(
    gql`
      query Product($id: ID!, $locale: I18NLocaleCode) {
        product(id: $id, locale: $locale) {
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
                    url
                    width
                    height
                    mime
                  }
                }
              }
              ${(options?.short_description && 'short_description') || ''}
              ${(options?.colors && '...colors') || ''}
            }
          }
        }
      }

      ${(options?.colors && colorsFragment) || ''}
    `,
    queryVariables
  );

  return product;
};

export type graphQLProductsProps = {
  data: {
    id: number;
    attributes: {
      title: string;
      slug: string;
      price: number;
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
      short_description?: string;
      colors?: [
        {
          color: string;
          product: {
            data: {
              id: number;
            };
          };
        }
      ];
    };
  }[];
};

export type ComponentSectionsProductSelectedList = {
  page: {
    data: {
      attributes: {
        content: [
          {
            Filters: string;
            products: graphQLProductsProps;
          }
        ];
      };
    };
  };
};

/**
 * Query all products from the component ProductSelectedList from Strapi
 * @param locale language of the requested page
 * @param pageID id of the page in wich the section is
 * @returns data of products
 */
export const QueryProductSelectedList = async (
  locale: string,
  pageID: number
) => {
  const queryVariables = {
    locale: locale,
    pageID: pageID,
  };

  const fragment = gql`
    fragment sectionsProductSelectedList on ComponentSectionsProductSelectedList {
      Filters
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

  return page;
};
