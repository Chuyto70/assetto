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
          content: {
            __typename: string;
          };
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

// QUERY POUR LA SECTION PRODUCT SELECTED LIST
// query ProductSelectedList {
//   page(id: 1, locale: "fr") {
//     data {
//       attributes {
//         content {
//           ...sectionsProductSelectedList
//         }
//       }
//     }
//   }
// }

// fragment sectionsProductSelectedList on ComponentSectionsProductSelectedList {
//   Filters
//   products {
//     data {
//       attributes {
//         title
//       }
//     }
//   }
// }
