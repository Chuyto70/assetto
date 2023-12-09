import Image from "next/image";
import Link from "next/link";

import { gql, QueryContentComponent } from "@/lib/graphql";
import { includeLocaleLink, MediaUrl } from "@/lib/helper";
import { Product, UploadFile } from "@/lib/interfaces";

import FormatPrice from "@/components/elements/texts/FormatPrice";

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
                data: UploadFile;
              };
              products: {
                data: Product[];
              }
            }
          }[];
        };
        price_text?: string;
        short_description: boolean;
      }[];
    };
  };
};


const Categories = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType, 'category'], ComponentSectionsCategories, 'sectionsCategories');
  const { categories: { data }, price_text, short_description } = content[props.index];

  return (
    <section className="w-full max-w-screen-3xl px-3 md:px-6 lg:px-12">
      <ul className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {data.map((category) => (
          <li key={category.id}
            className="block h-fit text-center"
          >
            <Link title={category.attributes.title} href={includeLocaleLink(category.attributes.slug)}
              className="flex flex-col gap-3"
            >
              <Image className="h-full w-full object-center object-cover rounded-2xl transition-colors duration-300 border-2 border-transparent hover:border-primary-600"
                width={category.attributes.image.data.attributes.width}
                height={category.attributes.image.data.attributes.height}
                src={MediaUrl(category.attributes.image.data.attributes.url)}
                alt={category.attributes.image.data.attributes.alternativeText ?? ''}
                sizes="100vw (min-width: 768px) 70vw"
              />
              <div>
                <h3 className="text-base md:text-lg line-clamp-2">{category.attributes.title}</h3>
                {price_text && category.attributes.products.data.length > 0 && <p className="text-sm md:text-base text-primary-600 font-semibold line-clamp-2"><FormatPrice text={price_text} prices={category.attributes.products.data[0].attributes.prices} /></p>}
                {short_description && <p className="text-sm text-carbon-700 dark:text-carbon-400 line-clamp-2">{category.attributes.short_description}</p>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Categories;