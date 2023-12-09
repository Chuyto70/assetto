import Link from "next/link";

import { gql, QueryContentComponent } from "@/lib/graphql";
import { includeLocaleLink, MediaUrl } from "@/lib/helper";
import { Media } from "@/lib/interfaces";

import CarouselBtn from "@/components/elements/carousel/CarouselBtn";
import CarouselItem from "@/components/elements/carousel/CarouselItem";
import EmblaCarousel from "@/components/elements/carousel/EmblaCarousel";
import DynamicIcon from "@/components/elements/DynamicIcon";
import NextImage from "@/components/NextImage";

import { useServer } from "@/store/serverStore";

const ComponentSectionsMediaCarousel = gql`
  fragment sectionsMediaCarousel on ComponentSectionsMediaCarousel {
    title
    medias {
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
                mime
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
        title?: string;
        medias: {
          data: Media[];
        }
      }[];
    };
  };
};


const MediaCarousel = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType, 'media'], ComponentSectionsMediaCarousel, 'sectionsMediaCarousel');
  const { title, medias } = content[props.index];


  return (
    <section className="w-full flex flex-col items-center gap-3 md:gap-6">
      {title && <h2>{title}</h2>}
      {/* More than 2 item display carousel */}
      {medias.data.length > 2 && <div className="w-full flex justify-center overflow-hidden">
        <EmblaCarousel
          className="w-full max-w-screen-xl overflow-visible no-scrollbar"
          containerClassName="w-full"
          options={{ loop: true, containScroll: 'trimSnaps', }}
          autoplay={false}
          autoplayOptions={{
            delay: 5000,
            stopOnInteraction: false,
          }}
        >
          {medias.data.map((media, index) => {
            const { ext_video, thumbnail, slug, media: uploadFile, name } = media.attributes;

            if ((ext_video && thumbnail.data) || (uploadFile.data?.attributes.mime.startsWith('video/') && thumbnail.data)) return (
              <CarouselItem key={media.id}
                index={index}
                className="w-2/3 relative h-fit group/item"
                nxSelectedClassName="z-10 is-selected"
                wrapperClassNames="relative left-1/2 -translate-x-1/2 w-[110%] h-fit aspect-video scale-90 transition-transform duration-300 [&>a]:after:bg-carbon-900/60 [&>a]:after:transition-colors [&>a]:after:w-full [&>a]:after:h-full [&>a]:after:absolute [&>a]:after:inline-block [&>a]:after:top-0 [&>a]:after:left-0 [&>a]:after:rounded-2xl"
                nxSelectedClassNames="scale-100 [&>a]:after:bg-transparent"
                nX={0}
              >
                <Link href={includeLocaleLink(`/media/${slug}`)}
                  scroll={false}
                  className="relative z-10 pointer-cursor"
                >
                  <DynamicIcon
                    icon='ph:play-fill'
                    wrapperClassName="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
                    className="w-8 h-8 md:w-10 md:h-10"
                  />
                  <NextImage
                    className='w-full h-full'
                    imgClassName='rounded-2xl w-full h-full object-cover object-center'
                    width={thumbnail.data.attributes.width}
                    height={thumbnail.data.attributes.height}
                    src={MediaUrl(thumbnail.data.attributes.url)}
                    alt={thumbnail.data.attributes.alternativeText ?? ''}
                    sizes='90vw (min-width: 1280px) 60vw'
                  />
                </Link>
                <div className="transition-opacity duration-300 opacity-0 group-[.is-selected]/item:opacity-100 mt-3 md:mt-6 flex justify-center items-center flex-nowrap px-3">
                  <CarouselBtn icon="material-symbols:arrow-left-alt-rounded" className="text-carbon-700 dark:text-carbon-400 hover:text-carbon-900 dark:hover:text-carbon-200 transition-colors w-full flex justify-end" iconClassName="w-6 h-6 md:w-8 md:h-8" />
                  {name && <h3 className="shrink-0 max-w-full px-3 text-center text-sm md:text-lg font-normal text-carbon-700 dark:text-carbon-400">{name}</h3>}
                  <CarouselBtn isNext={true} icon="material-symbols:arrow-right-alt-rounded" className="text-carbon-700 dark:text-carbon-400 hover:text-carbon-900 dark:hover:text-carbon-200 transition-colors w-full flex justify-start" iconClassName="w-6 h-6 md:w-8 md:h-8" />
                </div>
              </CarouselItem>
            );

            else if (uploadFile.data?.attributes.mime.startsWith('image/')) return (
              <CarouselItem key={media.id}
                index={index}
                className="w-2/3 relative h-fit group/item"
                nxSelectedClassName="z-10 is-selected"
                wrapperClassNames="relative left-1/2 -translate-x-1/2 w-[110%] h-fit aspect-video scale-90 transition-transform duration-300 [&>a]:after:bg-carbon-900/60 [&>a]:after:transition-colors [&>a]:after:w-full [&>a]:after:h-full [&>a]:after:absolute [&>a]:after:inline-block [&>a]:after:top-0 [&>a]:after:left-0 [&>a]:after:rounded-2xl"
                nxSelectedClassNames="scale-100 [&>a]:after:bg-transparent"
                nX={0}
              >
                <Link href={includeLocaleLink(`/media/${slug}`)}
                  scroll={false}
                  className="relative z-10 pointer-cursor"
                >
                  <NextImage
                    className='w-full h-full'
                    imgClassName='rounded-2xl w-full h-full object-cover object-center'
                    width={uploadFile.data.attributes.width}
                    height={uploadFile.data.attributes.height}
                    src={MediaUrl(uploadFile.data.attributes.url)}
                    alt={uploadFile.data.attributes.alternativeText ?? ''}
                    sizes='90vw (min-width: 1280px) 60vw'
                  />
                </Link>
                <div className="transition-opacity duration-300 opacity-0 group-[.is-selected]/item:opacity-100 mt-3 md:mt-6 flex justify-center items-center flex-nowrap px-3">
                  <CarouselBtn icon="material-symbols:arrow-left-alt-rounded" className="text-carbon-700 dark:text-carbon-400 hover:text-carbon-900 dark:hover:text-carbon-200 transition-colors w-full flex justify-end" iconClassName="w-6 h-6 md:w-8 md:h-8" />
                  {name && <h3 className="shrink-0 max-w-full px-3 text-center text-sm md:text-lg font-normal text-carbon-700 dark:text-carbon-400">{name}</h3>}
                  <CarouselBtn isNext={true} icon="material-symbols:arrow-right-alt-rounded" className="text-carbon-700 dark:text-carbon-400 hover:text-carbon-900 dark:hover:text-carbon-200 transition-colors w-full flex justify-start" iconClassName="w-6 h-6 md:w-8 md:h-8" />
                </div>
              </CarouselItem>
            );

            else return null;
          })}
        </EmblaCarousel>
      </div>}


      {/* Less than 3 item only centered image */}
      {medias.data.length < 3 && <div className="px-3 md:px-6 lg:px-12 w-full max-w-screen-xl flex justify-center gap-3 md:gap-6">
        {medias.data.map((media) => {
          const { ext_video, thumbnail, slug, media: uploadFile, name } = media.attributes;

          if ((ext_video && thumbnail.data) || (uploadFile.data?.attributes.mime.startsWith('video/') && thumbnail.data)) return (
            <Link href={includeLocaleLink(`/media/${slug}`)}
              key={media.id}
              scroll={false}
              className="w-1/2 pointer-cursor relative"
            >
              <DynamicIcon
                icon='ph:play-fill'
                wrapperClassName="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md"
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <NextImage
                className="w-full aspect-video"
                imgClassName="rounded-2xl object-center object-cover w-full h-full"
                width={thumbnail.data.attributes.width}
                height={thumbnail.data.attributes.height}
                src={MediaUrl(thumbnail.data.attributes.url)}
                alt={thumbnail.data.attributes.alternativeText ?? ''}
                sizes='90vw (min-width: 1280px) 60vw'
              />
              {name && <h3 className="mt-3 md:mt-6 text-center text-sm md:text-lg font-normal text-carbon-700 dark:text-carbon-400">{name}</h3>}
            </Link>
          );

          else if (uploadFile.data?.attributes.mime.startsWith('image/')) return (
            <Link href={includeLocaleLink(`/media/${slug}`)}
              key={media.id}
              scroll={false}
              className="w-1/2 pointer-cursor"
            >
              <NextImage
                className="w-full aspect-video"
                imgClassName="rounded-2xl object-center object-cover w-full h-full"
                width={uploadFile.data.attributes.width}
                height={uploadFile.data.attributes.height}
                src={MediaUrl(uploadFile.data.attributes.url)}
                alt={uploadFile.data.attributes.alternativeText ?? ''}
                sizes='90vw (min-width: 1280px) 60vw'
              />
              {name && <h3 className="mt-3 md:mt-6 text-center text-sm md:text-lg font-normal text-carbon-700 dark:text-carbon-400">{name}</h3>}
            </Link>
          );

          else return null;
        })}
      </div>}
    </section>
  )
}

export default MediaCarousel;