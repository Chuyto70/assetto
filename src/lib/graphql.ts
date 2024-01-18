import { gql, GraphQLClient } from 'graphql-request';

import {
  Article,
  Category,
  CookiesSetting,
  localeProps,
  Media,
  Menu,
  Order,
  Page,
  Product,
  QueryMetaProps,
  Redirection,
  Setting,
  UploadFile,
} from '@/lib/interfaces';

import { ContactFormType } from '@/components/elements/forms/ContactForm';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
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
    fetch(url as URL, { ...options, next: { tags: ['setting'] } });

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
              payment_provider
              mapbox_public_key
              default_currency
              currencies
              paypal_client_id
              google_tag_id
              provide_support_script
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
 * Query cookies in settings from Strapi
 * @returns cookies settings data
 */
export const QueryCookiesSettings = async (locale: string) => {
  const queryVariables = {
    locale: locale,
  };

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL, { ...options, next: { tags: ['setting'] } });

  const { setting } = await StrapiClient.request<{
    setting: {
      data: {
        attributes: CookiesSetting;
      };
    };
  }>(
    gql`
      query CookiesSettings($locale: I18NLocaleCode!) {
        setting(locale: $locale) {
          data {
            attributes {
              cookies {
                name
                description
                mandatory
                default
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
    fetch(url as URL,{ ...options, next: { tags: ['static_texts'] } });

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
    fetch(url as URL,{
      ...options,
      next: { tags: ['page', 'product', 'category'] },
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
    meta: QueryMetaProps;
  };
  products: {
    data: Product[];
    meta: QueryMetaProps;
  };
  categories: {
    data: Category[];
    meta: QueryMetaProps;
  };
  articles: {
    data: Article[];
    meta: QueryMetaProps;
  };
  medias: {
    data: Media[];
    meta: QueryMetaProps;
  };
};

/**
 * Query all paths from Strapi
 * @returns list of paths including languages
 */
export const QueryAllPaths = async (
  page?: number,
  pageSize = 50,
) => {

  const queryVariables = {
    page,
    pageSize,
  };

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{
      ...options,
      next: { tags: ['page', 'product', 'category', 'media'] },
    });

  const data = await StrapiClient.request<graphQLPathsProps>(
    gql`
      query Paths($page: Int, $pageSize: Int) {
        pages(publicationState: LIVE, locale: "all", pagination: { page: $page, pageSize: $pageSize }) {
          data {
            id
            attributes {
              locale
              slug
              updatedAt
            }
          }
          meta {
            pagination {
              page
              pageCount
            }
          }
        }
      
        products(publicationState: LIVE, locale: "all", pagination: { page: $page, pageSize: $pageSize }) {
          data {
            id
            attributes {
              locale
              slug
              updatedAt
            }
          }
          meta {
            pagination {
              page
              pageCount
            }
          }
        }
      
        categories(locale: "all", pagination: { page: $page, pageSize: $pageSize }) {
          data {
            id
            attributes {
              locale
              slug
              updatedAt
            }
          }
          meta {
            pagination {
              page
              pageCount
            }
          }
        }
        
        articles(locale: "all", publicationState: LIVE, pagination: { page: $page, pageSize: $pageSize }) {
          data {
            id
            attributes {
              locale
              slug
              updatedAt
            }
          }
          meta {
            pagination {
              page
              pageCount
            }
          }
        }
      
        medias(locale: "all", publicationState: LIVE, pagination: { page: $page, pageSize: $pageSize }) {
          data {
            id
            attributes {
              locale
              slug
              updatedAt
            }
          }
          meta {
            pagination {
              page
              pageCount
            }
          }
        }
      }    
    `,
    queryVariables
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
    fetch(url as URL,{
      ...options,
      next: { tags: ['page', 'product', 'category'] },
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
    fetch(url as URL,{ ...options, next: { tags: ['page'] } });

  const { pages } = await StrapiClient.request<{ pages: { data: Page[]}}>(
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
              slug
              content {
                __typename
              }
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

/**
 * Query a single category from Strapi
 * @param locale language of the requested page
 * @param slug array of slugs
 * @returns data of a page with direct content
 */
export const QueryCategoryFromSlug = async (
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
    fetch(url as URL,{ ...options, next: { tags: ['category'] } });

  const { categories } = await StrapiClient.request<{ categories: { data: Category[]}}>(
    gql`
      query CategoryFromSlug($locale: I18NLocaleCode!, $joinedSlug: String!) {
        categories(
          filters: { slug: { eq: $joinedSlug } }
          locale: $locale
          pagination: { limit: 1 }
        ) {
          data {
            id
            attributes {
              title
              slug
              description
              price_text
              btn_text
              products {
                data {
                  id
                  attributes {
                    title
                    slug
                    description
                    medias {
                      data {
                        attributes {
                          name
                          width
                          height
                          caption
                          alternativeText
                          url
                          mime
                        }
                      }
                    }
                    prices {
                      price
                      sale_price
                      on_sale_to
                      on_sale_from
                      currency
                      currency_symbol
                    }
                  }
                }
              }
              content {
                __typename
              }
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

  return categories;
};

/**
 * Query a single article from Strapi
 * @param locale language of the requested page
 * @param slug array of slugs
 * @returns data of a page with direct content
 */
export const QueryArticleFromSlug = async (
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
    fetch(url as URL,{ ...options, next: { tags: ['article'] } });

  const { articles } = await StrapiClient.request<{ articles: { data: Article[]}}>(
    gql`
      query ArticleFromSlug($locale: I18NLocaleCode!, $joinedSlug: String!) {
        articles(
          filters: { slug: { eq: $joinedSlug } }
          locale: $locale
          pagination: { limit: 1 }
        ) {
          data {
            id
            attributes {
              title
              slug
              short_description
              cover {
                data {
                  id
                  attributes {
                    name
                    width
                    height
                    alternativeText
                    caption
                    url
                    mime
                  }
                }
              }
              content
              author
              metadata {
                template_title
                title_suffix
                meta_description
              }
              publishedAt
              updatedAt
            }
          }
        }
      }    
    `,
    queryVariables
  );

  return articles;
};

/**
 * Query a latest articles
 * @param locale locale of the article
 * @param page number of page to query
 * @param pageSize number of the page size to query
 * @returns multiple articles
 */
export const QueryLatestArticle = async (locale: string, page: number, pageSize: number) => {
  const queryVariables = {
    locale,
    page,
    pageSize
  };

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{
      ...options,
      next: { tags: ['article'] },
    });

  const { articles } = await StrapiClient.request<{
    articles: { data: Article[], meta: QueryMetaProps };
  }>(
    gql`
      query latestArticles($locale: I18NLocaleCode!, $page: Int!, $pageSize: Int!) {
        articles(
          locale: $locale
          publicationState: LIVE
          sort: "createdAt:desc"
          pagination: { page: $page, pageSize: $pageSize }
        ) {
          data {
            id
            attributes {
              title
              slug
              short_description
              thumbnail {
                data {
                  id
                  attributes {
                    name
                    alternativeText
                    caption
                    width
                    height
                    url
                    mime
                  }
                }
              }
              author
              publishedAt
            }
          }
          meta {
            pagination {
              page
              pageCount
            }
          }
        }
      }
    `,
    queryVariables
  );

  return articles;
};

/**
 * Query a single product from Strapi
 * @param id id of the product
 * @param disableCaching disable fetch caching
 * @returns data of a product
 */
export const QueryProduct = async (id: number, disableCaching = false) => {
  const queryVariables = {
    id: id,
  };

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{
      ...options,
      next: { tags: ['product'] },
      cache: `${disableCaching ? 'no-store' : 'default'}`,
    });

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
              description
              short_description
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
              categories {
                data {
                  id
                  attributes {
                    slug
                  }
                }
              }
              prices {
                currency
                price
                sale_price
                on_sale_from
                on_sale_to
                currency_symbol
                details {
                  line_name
                  amount
                }
                paypal_plan_id
              }
              categories {
                data {
                  attributes {
                    title
                    slug
                  }
                }
              }
              success_page {
                data {
                  attributes {
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
    fetch(url as URL,{ ...options, next: { tags: ['product'] } });

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
              description
              short_description
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
              categories {
                data {
                  id
                  attributes {
                    slug
                  }
                }
              }
              prices {
                currency
                price
                sale_price
                on_sale_from
                on_sale_to
                currency_symbol
                details {
                  line_name
                  amount
                }
                paypal_plan_id
              }
              categories {
                data {
                  attributes {
                    title
                    slug
                  }
                }
              }
              success_page {
                data {
                  attributes {
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
 * Query menus from Strapi
 * @param locale language of the requested page
 * @returns the menus objects
 */
export const QueryMenus = async (locale: string) => {
  const queryVariables = {
    locale: locale,
  };

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{ ...options, next: { tags: ['menu'] } });

  const { menu } = await StrapiClient.request<{
    menu: { data: Menu };
  }>(
    gql`
      query QueryMenus {
        menu {
          data {
            attributes {
              header {
                id
                logo {
                  data {
                    attributes {
                      alternativeText
                      width
                      height
                      url
                    }
                  }
                }
                logo_link
                items {
                  id
                  link {
                    id
                    name
                    href
                    icon
                    style
                    direction
                    variant
                    relationship
                  }
                  sublinks {
                    id
                    name
                    href
                    icon
                    style
                    direction
                    variant
                    relationship
                  }
                }
              }

              footer {
                id
                columns {
                  id
                  logo {
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
                  title
                  description
                  socials {
                    id
                    name
                    href
                    icon
                    style
                    direction
                    variant
                    relationship
                  }
                  links {
                    id
                    name
                    href
                    icon
                    style
                    direction
                    variant
                    relationship
                  }
                }
                copyright
              }
            }
          }
        }
      }
    `,
    queryVariables
  );

  return menu;
};

/**
 * Query content of a specific component on a page from Strapi
 * @param locale language of the requested page
 * @param id id of the page or other in wich the section is
 * @param type type of the query (page, category, product)
 * @param tags tags for the cached query (page, category, product)
 * @param fragment pass the fragment of the component
 * @param fragmentSpread the query spread of the fragment without ...
 * @returns data of products
 */
export const QueryContentComponent = async (
  locale: string,
  id: number,
  type: string,
  tags: string[],
  fragment: string,
  fragmentSpread: string
) => {
  const queryVariables = {
    locale: locale,
    id: id,
  };

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{ ...options, next: { tags: [...tags] } });

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
  
  return response[type];
};

/**
 * Query a single order from Strapi
 * @param payment_intent_id payment intent of stripe
 * @returns data of the order
 */
export const QueryOrderFromPaymentIntent = async (
  payment_intent_id: string
) => {
  const queryVariables = {
    payment_intent_id,
  };

  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{ ...options, cache: 'no-store' });

  const { orders } = await StrapiClient.request<{
    orders: { data: Order[] };
  }>(
    gql`
      query orderFromPaymentIntent($payment_intent_id: String!) {
        orders(filters: { payment_intent_id: { eq: $payment_intent_id } }) {
          data {
            id
            attributes {
              amount
              status
              products
            }
          }
        }
      }
    `,
    queryVariables
  );

  return orders;
};

/**
 * Create an order in Strapi and return Order details
 * @param input
 * @returns data of order
 */
export const MutationCreateOrder = async (input: unknown) => {
  const queryVariables = {
    input,
  };

  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{ ...options, cache: 'no-store' });

  const response = await StrapiClient.request<{ createOrder: { data: Order } }>(
    gql`
      mutation createOrder($input: OrderInput!) {
        createOrder(data: $input) {
          data {
            id
            attributes {
              payment_intent_id
              email
              billing_name
              billing_city
              billing_country
              billing_line1
              billing_line2
              billing_postal_code
              billing_state
              shipping_name
              shipping_city
              shipping_country
              shipping_line1
              shipping_line2
              shipping_postal_code
              shipping_state
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
 * @returns data of order
 */
export const MutationUpdateOrder = async (
  id: string | number,
  input: unknown
) => {
  const queryVariables = {
    id,
    input,
  };

  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{ ...options, cache: 'no-store' });

  const response = await StrapiClient.request<{ updateOrder: { data: Order } }>(
    gql`
      mutation updateOrder($id: ID!, $input: OrderInput!) {
        updateOrder(id: $id, data: $input) {
          data {
            id
            attributes {
              payment_intent_id
              email
              billing_name
              billing_city
              billing_country
              billing_line1
              billing_line2
              billing_postal_code
              billing_state
              shipping_name
              shipping_city
              shipping_country
              shipping_line1
              shipping_line2
              shipping_postal_code
              shipping_state
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
 * Delete an order in Strapi and return Order details
 * @param id
 * @returns data of order
 */
export const MutationDeleteOrder = async (id: string) => {
  const queryVariables = {
    id,
  };

  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{ ...options, cache: 'no-store' });

  const response = await StrapiClient.request<{ deleteOrder: { data: Order } }>(
    gql`
      mutation deleteOrder($id: ID!) {
        deleteOrder(id: $id) {
          data {
            id
            attributes {
              payment_intent_id
              email
              billing_name
              billing_city
              billing_country
              billing_line1
              billing_line2
              billing_postal_code
              billing_state
              shipping_name
              shipping_city
              shipping_country
              shipping_line1
              shipping_line2
              shipping_postal_code
              shipping_state
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
 * Query locales from Strapi
 * @returns locales
 */
export const Queryi18NLocales = async () => {
  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{ ...options, cache: 'no-store' });
  

  const response =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await StrapiClient.request<localeProps>(
      gql`
        query i18NLocales {
          i18NLocales {
            data {
              attributes {
                code
                name
              }
            }
          }
        }
      `
    );

  return response;
};

/**
 * Query Media from slug
 * @param locale 
 * @param slug slugs array
 * @returns media
 */
export const QueryMediaFromSlug = async (locale: string, slug: string[] | undefined) => {
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
  fetch(url as URL,{ ...options, next: { tags: ['media'] } });

  const response = await StrapiClient.request<{ medias: { data: Media[] } }>(
    gql`
      query MediaFromSlug($locale: I18NLocaleCode!, $joinedSlug: String!) {
        medias(
          filters: { slug: { eq: $joinedSlug } }
          locale: $locale
          pagination: { limit: 1 }
        ) {
          data {
            id
            attributes {
              name
              slug
              media {
                data {
                  attributes {
                    name
                    alternativeText
                    caption
                    width
                    height
                    url
                    mime
                  }
                }
              }
              thumbnail {
                data {
                  attributes {
                    name
                    alternativeText
                    caption
                    width
                    height
                    url
                  }
                }
              }
              ext_video

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

  return response;
};

/**
 * Query Media from slug
 * @param locale 
 * @param slug slugs array
 * @returns media
 */
export const QueryUploadFileFromSrc = async (src: string) => {

  const queryVariables = {
    src,
  };

  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
  fetch(url as URL,{ ...options, next: { tags: ['file'] } });

  const response = await StrapiClient.request<{ uploadFiles: { data: UploadFile[] } }>(
    gql`
      query uploadFileFromSrc($src: String!) {
        uploadFiles(filters: { url: { eq: $src } }) {
          data {
            id
            attributes {
              name
              url
              width
              height
              mime
              caption
              alternativeText
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
 * Update or Create a game-request in Strapi and return details
 * @param input
 * @returns data of order
 */
export const MutationUpsertGameRequest = async (
  input: unknown
) => {
  const queryVariables = {
    input,
  };

  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{ ...options, cache: 'no-store' });

  const response = await StrapiClient.request<{ upsertGameRequest: { data: unknown } }>(
    gql`
      mutation upsertGameRequest($input: GameRequestInput!) {
        upsertGameRequest(data: $input) {
          attributes {
            email
            game
          }
        }
      }
    `,
    queryVariables
  );

  return response;
};

/**
 * Request Strapi to send contact mail
 * @param input
 * @returns data of order
 */
export const MutationSendContactMail = async (
  locale: string,
  data: ContactFormType
) => {
  const queryVariables = {
    locale,
    data,
  };

  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{ ...options, cache: 'no-store' });

  const response = await StrapiClient.request<{ sendContactMail: { data: null } }>(
    gql`
      mutation sendContactMail($locale: I18NLocaleCode!, $data: sendContactMailDataType!) {
        sendContactMail(locale: $locale, data: $data)
      }
    `,
    queryVariables
  );

  return response;
};

/**
 * Query all redirections 
 * @param page nb of the page to query
 * @param pageSize size of the page to query
 * @returns data of order
 */
export const QueryRedirections = async (
  page?: number,
  pageSize = 50,
) => {
  const queryVariables = {
    page,
    pageSize,
  };


  //Add revalidate Tags to next.js fetch
  StrapiClient.requestConfig.fetch = (url, options) =>
    fetch(url as URL,{ ...options, next: { tags: ['redirection'] } });

  const response = await StrapiClient.request<{
    redirections: {
      data: Redirection[];
      meta: { pagination: { page: number; pageCount: number; } }
    }
  }>(
    gql`
      query Redirections($page: Int, $pageSize: Int) {
        redirections(pagination: { page: $page, pageSize: $pageSize }) {
          data {
            attributes {
              newPath
              oldPath
              type
            }
          }
          meta {
            pagination {
              page
              pageCount
            }
          }
        }
      }
    `,
    queryVariables
  );

  return response;
};