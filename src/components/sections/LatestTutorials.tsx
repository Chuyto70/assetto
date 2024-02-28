
import Link from "next/link";

import { gql, QueryContentComponent } from "@/lib/graphql";
import { includeLocaleLink, MediaUrl } from "@/lib/helper";
import { Tutorial } from "@/lib/interfaces";

import NextImage from "@/components/NextImage";

import { useServer } from "@/store/serverStore";

const ComponentSectionsLatestTutorials = gql`
  fragment sectionLatestTutorials on ComponentSectionsLatestTutorials {
    title
    tutorials {
      data {
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
            cover {
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
            content
            author
            metadata {
              meta_description
            }
            locale
            tags
            updatedAt
            publishedAt
          }
      }
    }
  }
`;

type dataType = {
  data: {
    attributes: {
      content: {
        title: string;
        tutorials: {
          data: Tutorial[];
        };
      }[];
    };
  };
};



const LatestTutorials = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsLatestTutorials, 'sectionLatestTutorials');

  const { title, tutorials} = content[props.index];
  
  // const { data: articles, meta } = await QueryLatestTutorials(locale, 1, page_size);

  return (
    <section className="w-full max-w-screen-xl px-3 md:px-6 lg:px-12 flex flex-col items-center gap-3 md:gap-6">
      {title && <h2 className="italic">{title}</h2>}

      <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {tutorials.data.map((el) => (
          <li key={el.attributes.slug} className='w-auto max-w-[18rem] min-w-[18rem] md:h-64 xl:h-96 h-48'>
            <Link href={includeLocaleLink(`/${el.attributes.slug}`)} className="group relative flex h-48 flex-col overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-64 xl:h-96">
       
              <NextImage
                className='absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110'
                imgClassName='w-full h-full object-cover object-center rounded-lg'
                useSkeleton
                width={el.attributes.thumbnail.data.attributes.width}
                height={el.attributes.thumbnail.data.attributes.height}
                src={MediaUrl(el.attributes.thumbnail.data.attributes.url)}
                alt={el.attributes.thumbnail.data.attributes.alternativeText ?? ''}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>

              <div className="relative mt-auto p-4">
                <h2 className="mb-2 text-xl font-semibold text-white transition duration-100">{el.attributes.title}</h2>

                <span className="font-semibold text-indigo-300">Read more</span>
              </div>
            </Link>
    
          </li>
        ))}

      </ul>
    </section>
  )
}

export default LatestTutorials;