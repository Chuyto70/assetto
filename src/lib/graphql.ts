import { gql, GraphQLClient } from 'graphql-request';

import { Category, Order, Page, Product, Setting } from '@/lib/interfaces';

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

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url, { ...options, next: { tags: ['settings'] } });

  const { setting } = await StrapiClient.request<{
    setting: {
      data: Setting;
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
 * Query static texts from Strapi
 * @returns translations of static text json format
 */
export const QueryStaticTexts = async (locale: string) => {
  const queryVariables = {
    locale: locale,
  };

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url, { ...options, next: { tags: ['static_texts'] } });

  const { staticText } = await StrapiClient.request<{
    staticText: {
      data: {
        attributes: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          translations: any;
        };
      };
    };
  }>(
    gql`
      query Settings($locale: I18NLocaleCode!) {
        staticText(locale: $locale) {
          data {
            attributes {
              translations
            }
          }
        }
      }
    `,
    queryVariables
  );

  return staticText.data.attributes;
};

/**
 * Query page, product or category id from slug
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

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url, {
      ...options,
      next: { tags: ['pages', 'products', 'categories'] },
    });

  const data = await StrapiClient.request<{
    pages: {
      data: Page[];
    };
    products: {
      data: Product[];
    };
    categories: {
      data: Category[];
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
    data: Page[];
  };
  products: {
    data: Product[];
  };
  categories: {
    data: Category[];
  };
};

/**
 * Query all paths from Strapi
 * @returns list of paths including languages
 */
export const QueryAllPaths = async () => {
  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url, {
      ...options,
      next: { tags: ['pages', 'products', 'categories'] },
    });

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

/**
 * Query seo from Strapi
 * @param locale language of the requested page
 * @param slug array of slugs
 * @returns seo data
 */
export const QuerySeo = async (locale: string, slug: string[] | undefined) => {
  const joinedSlug = !slug
    ? '/'
    : slug instanceof Array
    ? slug.join('/')
    : Array.of(slug).join('/');

  const queryVariables = {
    locale: locale,
    joinedSlug: joinedSlug,
  };

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url, {
      ...options,
      next: { tags: ['pages', 'products', 'categories'] },
    });

  const data = await StrapiClient.request<{
    pages: {
      data: Page[];
    };
    products: {
      data: Product[];
    };
    categories: {
      data: Category[];
    };
  }>(
    gql`
      query Seo($locale: I18NLocaleCode!, $joinedSlug: String!) {
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

        products(
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

        categories(
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

  return data;
};

type graphQLPageProps = {
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
export const QueryPageFromSlug = async (
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

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url, { ...options, next: { tags: ['pages'] } });

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

/**
 * Query a single product from Strapi
 * @param id id of the product
 * @returns data of a product
 */
export const QueryProduct = async (id: number) => {
  const queryVariables = {
    id: id,
  };

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url, { ...options, next: { tags: ['products'] } });

  const { product } = await StrapiClient.request<{
    product: { data: Product };
  }>(
    gql`
      query Product($id: ID!) {
        product(id: $id) {
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
              short_description
              sizes {
                size
                quantity
              }
              colors {
                name
                color
                product {
                  data {
                    id
                    attributes {
                      slug
                    }
                  }
                }
              }
              categories {
                data {
                  attributes {
                    title
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

  return product;
};

/**
 * Query a single product from Strapi
 * @param locale language of the requested page
 * @param slug slug of the product
 * @returns data of a product
 */
export const QueryProductFromSlug = async (
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

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url, { ...options, next: { tags: ['products'] } });

  const { products } = await StrapiClient.request<{
    products: { data: Product[] };
  }>(
    gql`
      query QueryProductFromSlug(
        $locale: I18NLocaleCode!
        $joinedSlug: String!
      ) {
        products(
          filters: { slug: { eq: $joinedSlug } }
          locale: $locale
          pagination: { limit: 1 }
        ) {
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
              short_description
              sizes {
                size
                quantity
              }
              colors {
                name
                color
                product {
                  data {
                    id
                    attributes {
                      slug
                    }
                  }
                }
              }
              categories {
                data {
                  attributes {
                    title
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

  return products;
};

/**
 * Query content of a specific component on a page from Strapi
 * @param locale language of the requested page
 * @param id id of the page or other in wich the section is
 * @param type type of the query (page, category, product)
 * @param fragment pass the fragment of the component
 * @param fragmentSpread the query spread of the fragment without ...
 * @returns data of products
 */
export const QueryContentComponent = async (
  locale: string,
  id: number,
  type: string,
  fragment: string,
  fragmentSpread: string
) => {
  const queryVariables = {
    locale: locale,
    id: id,
  };

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url, { ...options, next: { tags: [type] } });

  const response =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await StrapiClient.request<any>(
      gql`
        query QueryContentComponent($id: ID!, $locale: I18NLocaleCode!) {
          ${type}(id: $id, locale: $locale) {
            data {
              attributes {
                content {
                  ...${fragmentSpread}
                }
              }
            }
          }
        }
        ${fragment}
      `,
      queryVariables
    );

  return response;
};

/**
 * Create an order in Strapi and return Order details
 * @param input
 * @returns data of products
 */
export const MutationCreateOrder = async (input: unknown) => {
  const queryVariables = {
    input,
  };

  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url, { ...options, cache: 'no-store' });

  const response = await StrapiClient.request<{ createOrder: { data: Order } }>(
    gql`
      mutation createOrder($input: OrderInput!) {
        createOrder(data: $input) {
          data {
            id
            attributes {
              payment_intent_id
              name
              email
              city
              country
              line1
              line2
              postal_code
              state
              status
              amount
              products
              createdAt
              updatedAt
            }
          }
        }
      }
    `,
    queryVariables
  );

  return response;
};

/**
 * Update an order in Strapi and return Order details
 * @param id
 * @param input
 * @returns data of products
 */
export const MutationUpdateOrder = async (id: string, input: unknown) => {
  const queryVariables = {
    id,
    input,
  };

  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url, { ...options, cache: 'no-store' });

  const response = await StrapiClient.request<{ updateOrder: { data: Order } }>(
    gql`
      mutation updateOrder($id: ID!, $input: OrderInput!) {
        updateOrder(id: $id, data: $input) {
          data {
            id
            attributes {
              payment_intent_id
              name
              email
              city
              country
              line1
              line2
              postal_code
              state
              status
              amount
              products
              createdAt
              updatedAt
            }
          }
        }
      }
    `,
    queryVariables
  );

  return response;
};

/**
 * Update an order in Strapi and return Order details
 * @param id
 * @param input
 * @returns data of products
 */
export const MutationDeleteOrder = async (id: string) => {
  const queryVariables = {
    id,
  };

  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url, { ...options, cache: 'no-store' });

  const response = await StrapiClient.request<{ deleteOrder: { data: Order } }>(
    gql`
      mutation deleteOrder($id: ID!) {
        deleteOrder(id: $id) {
          data {
            id
            attributes {
              payment_intent_id
              name
              email
              city
              country
              line1
              line2
              postal_code
              state
              status
              amount
              products
              createdAt
              updatedAt
            }
          }
        }
      }
    `,
    queryVariables
  );

  return response;
};
