import Link from "next/link";

import { gql, QueryContentComponent } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";
import { Media } from "@/lib/interfaces";

import CarouselItem from "@/components/elements/carousel/CarouselItem";
import EmblaCarousel from "@/components/elements/carousel/EmblaCarousel";
import NextImage from "@/components/NextImage";

import { useServer } from "@/store/serverStore";

const ComponentSectionsMediaCarousel = gql`
  fragment sectionsMediaCarousel on ComponentSectionsMediaCarousel {
    title
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
  page: {
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
};


const MediaCarousel = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages', 'medias'], ComponentSectionsMediaCarousel, 'sectionsMediaCarousel');
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
            const { ext_video, thumbnail, slug, media: uploadFile } = media.attributes;

            if ((ext_video && thumbnail.data) || (uploadFile.data?.attributes.mime.startsWith('video/') && thumbnail.data)) return (
              <CarouselItem key={media.id}
                index={index}
                className="w-2/3 relative h-fit"
                nxSelectedClassName="z-10"
                wrapperClassNames="relative left-1/2 -translate-x-1/2 w-[110%] h-fit aspect-video scale-90 transition-transform duration-300 after:bg-carbon-900/60 after:transition-colors after:w-full after:h-full after:absolute after:inline-block after:top-0 after:left-0 after:rounded-2xl"
                nxSelectedClassNames="scale-100 after:bg-transparent"
                nX={0}
              >
                <Link href={`/${locale}/media/${slug}`}
                  scroll={false}
                  className="relative z-10 pointer-cursor"
                >
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
              </CarouselItem>
            );

            else if (uploadFile.data?.attributes.mime.startsWith('image/')) return (
              <></>
            );

            else return null;
          })}
        </EmblaCarousel>
      </div>}


      {/* Less than 1 item only centered image */}
    </section>
  )
}

export default MediaCarousel;