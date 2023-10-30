
import Link from "next/link";

import { gql, QueryContentComponent } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";
import { Media } from "@/lib/interfaces";

import DynamicIcon from "@/components/elements/DynamicIcon";
import NextImage from "@/components/NextImage";

import { useServer } from "@/store/serverStore";

const ComponentSectionsMediaGridAlt = gql`
  fragment sectionsMediaGridAlt on ComponentSectionsMediaGridAlt {
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
  data: {
    attributes: {
      content: {
        medias: {
          data: Media[];
        }
      }[];
    };
  };
};


const MediaGridAlt = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType, 'media'], ComponentSectionsMediaGridAlt, 'sectionsMediaGridAlt');
  const { medias } = content[props.index];

  return (
    <section className="w-full max-w-screen-3xl px-3 md:px-6 lg:px-12">
      <ul className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-6">
        {medias.data.map((media) => {
          const { ext_video, thumbnail, slug, media: uploadFile } = media.attributes;

          if ((ext_video || uploadFile.data?.attributes.mime.startsWith('video/')) && thumbnail.data) return (
            <li key={media.id}>
              <Link href={`/${locale}/media/${slug}`}
                scroll={false}
                className="relative"
              >
                <DynamicIcon
                  icon='ph:play-fill'
                  wrapperClassName="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
                  className="w-8 h-8 md:w-10 md:h-10"
                />
                <NextImage
                  useSkeleton
                  src={MediaUrl(thumbnail.data?.attributes.url ?? '')}
                  width={thumbnail.data?.attributes.width ?? 0}
                  height={thumbnail.data?.attributes.height ?? 0}
                  alt={thumbnail.data?.attributes.alternativeText ?? ''}
                  className="w-full aspect-video rounded-3xl overflow-hidden border-2 border-carbon-900 dark:border-transparent"
                  imgClassName='object-cover object-center w-full h-full'
                  sizes="100vw, (min-width: 475px) 50vw, (min-width: 1024px) 33vw, (min-width: 1536px) 25vw"
                />
              </Link>
            </li>
          );

          else if (uploadFile.data?.attributes.mime.startsWith('image/')) return (
            <li key={media.id}>
              <Link href={`/${locale}/media/${slug}`}
                scroll={false}
              >
                <NextImage
                  useSkeleton
                  src={MediaUrl(uploadFile.data?.attributes.url ?? '')}
                  width={uploadFile.data?.attributes.width ?? 0}
                  height={uploadFile.data?.attributes.height ?? 0}
                  alt={uploadFile.data?.attributes.alternativeText ?? ''}
                  className="w-full aspect-video rounded-3xl overflow-hidden border-2 border-carbon-900 dark:border-transparent"
                  imgClassName='object-cover object-center w-full h-full'
                  sizes="100vw, (min-width: 475px) 50vw, (min-width: 1024px) 33vw, (min-width: 1536px) 25vw"
                />
              </Link>
            </li>
          );

          else if (uploadFile.data?.attributes.mime.startsWith('video/') && !thumbnail.data) return (
            <li key={media.id}>
              <Link href={`/${locale}/media/${slug}`}
                scroll={false}
              >
                <video
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  width={uploadFile.data.attributes.width}
                  height={uploadFile.data.attributes.height}
                  className='rounded-3xl object-cover object-center w-full aspect-video border-2 border-carbon-900 dark:border-transparent'
                >
                  <source
                    src={MediaUrl(uploadFile.data.attributes.url)}
                    type={uploadFile.data.attributes.mime}
                  />
                  <meta itemProp='name' content={uploadFile.data.attributes.name} />
                  <meta
                    itemProp='description'
                    content={uploadFile.data.attributes.alternativeText}
                  />
                </video>
              </Link>
            </li>
          );

          else return null;
        })}
      </ul>
    </section>
  )
}

export default MediaGridAlt;