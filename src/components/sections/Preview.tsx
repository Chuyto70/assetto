import NextLink from "next/link";

import { gql, QueryContentComponent } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";
import { LinkInterface, Media } from "@/lib/interfaces";

import Link from "@/components/elements/links";
import NextImage from "@/components/NextImage";

import { useServer } from "@/store/serverStore";

const ComponentSectionsPreview = gql`
  fragment sectionPreview on ComponentSectionsPreview {
    title
    description
    link {
      name
      href
      open_new_tab
      icon
      style
      direction
      variant
    }
    media_1 {
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
    media_2 {
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
    media_3 {
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
  data: {
    attributes: {
      content: {
        title: string;
        description: string;
        link: LinkInterface;
        media_1: {
          data: Media;
        };
        media_2: {
          data: Media;
        };
        media_3: {
          data: Media;
        };
      }[];
    };
  };
};


const Preview = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsPreview, 'sectionPreview');
  const { title, description, link, media_1, media_2, media_3 } = content[props.index];

  return (
    <section className="w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl flex flex-col lg:flex-row items-center gap-6 md:gap-12">
      <div className="lg:w-1/2 flex flex-col items-center lg:items-start lg:justify-center gap-3 md:gap-6">
        <h2 className="text-center lg:text-left italic">{title}</h2>
        <p className="text-center lg:text-left">{description}</p>
        <Link
          href={link.href}
          openNewTab={link.open_new_tab}
          style={link.style}
          variant={link.variant}
          icon={link.icon}
          direction={link.direction}
          size="lg"
        >{link.name}</Link>
      </div>
      <div className="xs:w-4/5 lg:w-1/2 grid grid-cols-4 grid-rows-3 gap-3 md:gap-6">
        {(() => {
          if (!media_1.data) return null;
          const { ext_video, thumbnail, slug, media: uploadFile } = media_1.data.attributes;
          if (ext_video || (uploadFile.data?.attributes.mime.startsWith('video/') && thumbnail.data)) return (

            <NextLink href={`/${locale}/media/${slug}`}
              scroll={false}
              className="col-start-1 row-start-1 col-span-2 row-span-2 w-full"
            >
              <NextImage
                useSkeleton
                src={MediaUrl(thumbnail.data?.attributes.url ?? '')}
                width={thumbnail.data?.attributes.width ?? 0}
                height={thumbnail.data?.attributes.height ?? 0}
                alt={thumbnail.data?.attributes.alternativeText ?? ''}
                className="w-full aspect-square rounded-3xl overflow-hidden border-2 border-carbon-900"
                imgClassName='object-cover object-center w-full h-full'
              />
            </NextLink>

          );

          else if (uploadFile.data?.attributes.mime.startsWith('image/')) return (

            <NextLink href={`/${locale}/media/${slug}`}
              scroll={false}
              className="col-start-1 row-start-1 col-span-2 row-span-2 w-full"
            >
              <NextImage
                useSkeleton
                src={MediaUrl(uploadFile.data?.attributes.url ?? '')}
                width={uploadFile.data?.attributes.width ?? 0}
                height={uploadFile.data?.attributes.height ?? 0}
                alt={uploadFile.data?.attributes.alternativeText ?? ''}
                className="w-full aspect-square rounded-3xl overflow-hidden border-2 border-carbon-900"
                imgClassName='object-cover object-center w-full h-full'
              />
            </NextLink>
          );
        })()}
        {(() => {
          if (!media_2.data) return null;
          const { ext_video, thumbnail, slug, media: uploadFile } = media_2.data.attributes;
          if (ext_video || (uploadFile.data?.attributes.mime.startsWith('video/') && thumbnail.data)) return (

            <NextLink href={`/${locale}/media/${slug}`}
              scroll={false}
              className="col-start-3 row-start-1 col-span-2 row-span-2 w-full"
            >
              <NextImage
                useSkeleton
                src={MediaUrl(thumbnail.data?.attributes.url ?? '')}
                width={thumbnail.data?.attributes.width ?? 0}
                height={thumbnail.data?.attributes.height ?? 0}
                alt={thumbnail.data?.attributes.alternativeText ?? ''}
                className="w-full aspect-square rounded-3xl overflow-hidden border-2 border-carbon-900"
                imgClassName='object-cover object-center w-full h-full'
              />
            </NextLink>

          );

          else if (uploadFile.data?.attributes.mime.startsWith('image/')) return (

            <NextLink href={`/${locale}/media/${slug}`}
              scroll={false}
              className="col-start-3 row-start-1 col-span-2 row-span-2 w-full"
            >
              <NextImage
                useSkeleton
                src={MediaUrl(uploadFile.data?.attributes.url ?? '')}
                width={uploadFile.data?.attributes.width ?? 0}
                height={uploadFile.data?.attributes.height ?? 0}
                alt={uploadFile.data?.attributes.alternativeText ?? ''}
                className="w-full aspect-square rounded-3xl overflow-hidden border-2 border-carbon-900"
                imgClassName='object-cover object-center w-full h-full'
              />
            </NextLink>
          );
        })()}
        {(() => {
          if (!media_3.data) return null;
          const { ext_video, thumbnail, slug, media: uploadFile } = media_1.data.attributes;
          if (ext_video || (uploadFile.data?.attributes.mime.startsWith('video/') && thumbnail.data)) return (

            <NextLink href={`/${locale}/media/${slug}`}
              scroll={false}
              className="col-start-2 row-start-2 col-span-2 row-span-2 w-full"
            >
              <NextImage
                useSkeleton
                src={MediaUrl(thumbnail.data?.attributes.url ?? '')}
                width={thumbnail.data?.attributes.width ?? 0}
                height={thumbnail.data?.attributes.height ?? 0}
                alt={thumbnail.data?.attributes.alternativeText ?? ''}
                className="w-full aspect-square rounded-3xl overflow-hidden border-2 border-carbon-900"
                imgClassName='object-cover object-center w-full h-full'
              />
            </NextLink>

          );

          else if (uploadFile.data?.attributes.mime.startsWith('image/')) return (

            <NextLink href={`/${locale}/media/${slug}`}
              scroll={false}
              className="col-start-2 row-start-2 col-span-2 row-span-2 w-full"
            >
              <NextImage
                useSkeleton
                src={MediaUrl(uploadFile.data?.attributes.url ?? '')}
                width={uploadFile.data?.attributes.width ?? 0}
                height={uploadFile.data?.attributes.height ?? 0}
                alt={uploadFile.data?.attributes.alternativeText ?? ''}
                className="w-full aspect-square rounded-3xl overflow-hidden border-2 border-carbon-900"
                imgClassName='object-cover object-center w-full h-full'
              />
            </NextLink>
          );
        })()}
      </div>
    </section>
  )
}

export default Preview;