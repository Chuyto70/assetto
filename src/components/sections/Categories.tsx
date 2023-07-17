import Image from "next/image";
import Link from "next/link";

import { gql, QueryContentComponent } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";
import { Media } from "@/lib/interfaces";

import { useServer } from "@/store/serverStore";

const ComponentSectionsCategories = gql`
  fragment sectionsCategories on ComponentSectionsCategories {
    categories {
      data {
        id
        attributes {
          title
          slug
          short_description
          image {
            data {
              attributes {
                alternativeText
                caption
                width
                height
                url
              }
            }
          }

          products {
            data {
              attributes {
                prices {
                  price
                  currency
                  currency_symbol
                }
              }
            }
          }
        }
      }
    }

    price_text
    short_description
  }
`;

type dataType = {
  page: {
    data: {
      attributes: {
        content: {
          categories: {
            data: {
              id: number;
              attributes: {
                title: string;
                slug: string;
                short_description: string;
                image: {
                  data: Media;
                };
              }
            }[];
          };
          price_text?: string;
          short_description: boolean;
        }[];
      };
    };
  };
};


const Categories = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages', 'categories'], ComponentSectionsCategories, 'sectionsCategories');
  const { categories: { data } } = content[props.index];


  return (
    <section className="w-full max-w-screen-sm px-3 md:px-6 lg:px-12">
      <ul className="grid grid-cols-2 gap-3 md:gap-6">
        {data.map((category) => (
          <li key={category.id}>
            <Link href="/">
              <Image className="h-full w-full object-center object-cover brightness-75"
                width={category.attributes.image.data.attributes.width}
                height={category.attributes.image.data.attributes.height}
                src={MediaUrl(category.attributes.image.data.attributes.url)}
                alt={category.attributes.image.data.attributes.alternativeText ?? ''}
                sizes="100vw (min-width: 768px) 70vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Categories;