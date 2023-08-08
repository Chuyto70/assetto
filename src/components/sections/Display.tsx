import NextLink from "next/link";

import clsxm from "@/lib/clsxm";
import { gql, QueryContentComponent } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";
import { LinkInterface, Media } from "@/lib/interfaces";

import FramerInfinite from "@/components/elements/carousel/FramerInfinite";
import Link from "@/components/elements/links";
import NextImage from "@/components/NextImage";

import { useServer } from "@/store/serverStore";

const ComponentSectionsDisplay = gql`
  fragment sectionDisplay on ComponentSectionsDisplay {
    title
    description
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
    link {
      name
      href
      open_new_tab
      icon
      style
      direction
      variant
    }
  }
`;

type dataType = {
  data: {
    attributes: {
      content: {
        title?: string;
        description?: string;
        link: LinkInterface;
        medias: {
          data: Media[];
        }
      }[];
    };
  };
};


const Display = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsDisplay, 'sectionDisplay');
  const { title, description, link, medias } = content[props.index];

  return (
    <section className={clsxm("w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl flex flex-col lg:flex-row lg:items-center gap-6",
      medias.data.length > 4 && 'lg:flex-col lg:items-start'
    )}>
      <div className={clsxm("lg:w-1/2 lg:h-fit flex flex-col items-center text-center md:text-left gap-3 md:flex-row lg:flex-col md:justify-between lg:gap-6",
        medias.data.length > 4 && 'lg:w-full lg:flex-row'
      )}>
        {title && <h2 className="italic md:w-1/2 lg:w-full">{title}</h2>}
        <div className={clsxm("md:w-1/2 lg:w-full flex flex-col gap-3 lg:gap-6 items-center md:items-end lg:items-start",
          medias.data.length > 4 && 'lg:items-end'
        )}>
          {description && <p className={clsxm("text-carbon-700 dark:text-carbon-400",
            title && 'md:text-right lg:text-left',
            medias.data.length > 4 && 'lg:text-right'
          )}>{description}</p>}
          {link && <Link
            href={link.href}
            openNewTab={link.open_new_tab}
            style={link.style}
            variant={link.variant}
            icon={link.icon}
            direction={link.direction}
            size="lg"
            className=""
          >{link.name}</Link>}
        </div>
      </div>

      {medias.data.length < 5 && <div className="lg:w-1/2 h-fit flex flex-wrap justify-center items-start">
        {medias.data.map((media) => {
          const { ext_video, thumbnail, slug, media: uploadFile } = media.attributes;

          if (ext_video || (uploadFile.data?.attributes.mime.startsWith('video/') && thumbnail.data)) return (

            <NextLink href={`/${locale}/media/${slug}`}
              key={media.id}
              scroll={false}
              className="w-1/2 h-fit p-3"
            >
              <NextImage
                useSkeleton
                src={MediaUrl(thumbnail.data?.attributes.url ?? '')}
                width={thumbnail.data?.attributes.width ?? 0}
                height={thumbnail.data?.attributes.height ?? 0}
                alt={thumbnail.data?.attributes.alternativeText ?? ''}
                className="w-full aspect-video rounded-xl overflow-hidden shadow-xl"
                imgClassName='object-cover object-center w-full h-full'
              />
            </NextLink>

          );

          else if (uploadFile.data?.attributes.mime.startsWith('image/')) return (

            <NextLink href={`/${locale}/media/${slug}`}
              key={media.id}
              scroll={false}
              className="w-1/2 h-fit p-3"
            >
              <NextImage
                useSkeleton
                src={MediaUrl(uploadFile.data?.attributes.url ?? '')}
                width={uploadFile.data?.attributes.width ?? 0}
                height={uploadFile.data?.attributes.height ?? 0}
                alt={uploadFile.data?.attributes.alternativeText ?? ''}
                className="w-full aspect-video rounded-xl overflow-hidden shadow-xl"
                imgClassName='object-cover object-center w-full h-full'
              />
            </NextLink>
          );
        })}
      </div>}


      {/* 5 and more medias */}
      {medias.data.length > 4 && <div className="w-full overflow-hidden">
        <FramerInfinite leftToRight={true} >
          {medias.data.map((media) => {
            const { ext_video, thumbnail, slug, media: uploadFile } = media.attributes;

            if (ext_video || (uploadFile.data?.attributes.mime.startsWith('video/') && thumbnail.data)) return (

              <NextLink href={`/${locale}/media/${slug}`}
                key={media.id}
                scroll={false}
                className="shrink-0 grow-0 w-60 md:w-96 h-fit p-3"
              >
                <NextImage
                  useSkeleton
                  src={MediaUrl(thumbnail.data?.attributes.url ?? '')}
                  width={thumbnail.data?.attributes.width ?? 0}
                  height={thumbnail.data?.attributes.height ?? 0}
                  alt={thumbnail.data?.attributes.alternativeText ?? ''}
                  className="w-full aspect-video rounded-xl overflow-hidden"
                  imgClassName='object-cover object-center w-full h-full'
                />
              </NextLink>

            );

            else if (uploadFile.data?.attributes.mime.startsWith('image/')) return (

              <NextLink href={`/${locale}/media/${slug}`}
                key={media.id}
                scroll={false}
                className="shrink-0 grow-0 w-60 md:w-96 h-fit p-3"
              >
                <NextImage
                  useSkeleton
                  src={MediaUrl(uploadFile.data?.attributes.url ?? '')}
                  width={uploadFile.data?.attributes.width ?? 0}
                  height={uploadFile.data?.attributes.height ?? 0}
                  alt={uploadFile.data?.attributes.alternativeText ?? ''}
                  className="w-full aspect-video rounded-xl overflow-hidden"
                  imgClassName='object-cover object-center w-full h-full'
                />
              </NextLink>
            );
          })}
        </FramerInfinite>
      </div>}
    </section>
  )
}

export default Display;