
import { gql, QueryContentComponent } from "@/lib/graphql";

import { useServer } from "@/store/serverStore";

const ComponentSectionsMediaGrid = gql`
  fragment sectionsMediaGrid on ComponentSectionsMediaGrid {
    medias {
      data {
        id
        attributes {
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
        }
      }
    }
  }
`;

type dataType = {
  page: {
    data: {
      attributes: {
        content: {
          medias: {
            // data: Media[];
          }
        }[];
      };
    };
  };
};


const MediaGrid = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsMediaGrid, 'sectionsMediaGrid');
  const { medias } = content[props.index];


  return (
    <section className="w-full max-w-screen-3xl px-3 md:px-6 lg:px-12">
      <ul className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {/* {medias.data.map((media) => {
          if (media.attributes.mime.startsWith('image/')) {
            return (
              <li key={media.id}>
                <Link href={`/${locale}/media/${media.id}${media.attributes.name ? `/${media.attributes.name}` : ``}`}
                  scroll={false}
                >
                  <NextImage
                    useSkeleton
                    src={MediaUrl(media.attributes.url)}
                    width={media.attributes.width}
                    height={media.attributes.height}
                    alt={media.attributes.alternativeText ?? ''}
                    className="w-full aspect-square rounded-3xl overflow-hidden border-2 border-carbon-900 dark:border-transparent"
                    imgClassName='object-cover object-center w-full h-full'
                  />
                </Link>
              </li>
            );
          }
          if (media.attributes.mime.startsWith('video/')) {
            return (
              <li key={media.id}>
                <Link href={`/${locale}/media/${media.id}${media.attributes.name ? `/${media.attributes.name}` : ``}`}
                  scroll={false}
                >
                  <video
                    autoPlay={true}
                    loop={true}
                    muted={true}
                    width={media.attributes.width}
                    height={media.attributes.height}
                    className='rounded-3xl object-cover object-center w-full aspect-square border-2 border-carbon-900 dark:border-transparent'
                  >
                    <source
                      src={MediaUrl(media.attributes.url)}
                      type={media.attributes.mime}
                    />
                    <meta itemProp='name' content={media.attributes.name} />
                    <meta
                      itemProp='description'
                      content={media.attributes.alternativeText}
                    />
                  </video>
                </Link>
              </li>
            );
          }
        })} */}
      </ul>
    </section>
  )
}

export default MediaGrid;