import Image from "next/image";

import clsxm from "@/lib/clsxm";
import { gql, QueryContentComponent } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";
import { UploadFile } from "@/lib/interfaces";

import CarouselItem from "@/components/elements/carousel/CarouselItem";
import CarouselThumbs from "@/components/elements/carousel/CarouselThumbs";
import EmblaCarousel from "@/components/elements/carousel/EmblaCarousel";
import RemoteMDX from "@/components/elements/texts/RemoteMDX";
import NextImage from "@/components/NextImage";

import { useServer } from "@/store/serverStore";

const ComponentSectionsCarouselAlt = gql`
  fragment sectionsCarouselAlt on ComponentSectionsCarouselAlt {
    items {
      id
      title
      description
      thumb_image {
        data {
          attributes {
            alternativeText
            caption
            url
            width
            height
          }
        }
      }
      image {
        data {
          attributes {
            alternativeText
            caption
            url
            width
            height
          }
        }
      }
      featured
      featured_tag_text
      featured_text
    }
  }
`;

type dataType = {
  data: {
    attributes: {
      content: {
        items: {
          id: number;
          title: string;
          description: string;
          thumb_image: {
            data: UploadFile;
          },
          image: {
            data: UploadFile;
          },
          featured: boolean;
          featured_tag_text?: string;
          featured_text?: string;
        }[];
      }[];
    };
  };
};


const CarouselAlt = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsCarouselAlt, 'sectionsCarouselAlt');
  const { items } = content[props.index];

  const thumbs = (
    <div className="md:absolute md:w-1/4 right-0 md:h-full">
      <CarouselThumbs
        className="relative md:w-full md:h-full"
        containerClassName="grid auto-cols-fr grid-flow-col md:grid-flow-row md:auto-rows-fr md:h-full" //md:flex-col
        thumbClassName={clsxm(
          'relative overflow-hidden bg-carbon-200 dark:bg-carbon-900',
          'first:rounded-bl-3xl first:before:rounded-bl-3xl last:rounded-br-3xl last:before:rounded-br-3xl',
          'md:first:rounded-bl-none md:first:before:rounded-bl-none md:first:rounded-tr-3xl md:first:before:rounded-tr-3xl'
        )}
        activeClassName="before:absolute before:inset-0 before:border-2 before:border-primary-600"
        options={{
          dragFree: false,
          watchDrag: false,
          breakpoints: {
            '(min-width: 768px)': { axis: 'y' }
          }
        }}
      >
        {items.map((item) => (
          <div key={item.id}
            className="w-full h-full xs:p-2 lg:p-3 flex flex-row gap-2 lg:gap-3 items-center"
          >
            <NextImage
              className="h-full w-full xs:w-1/3 shrink-0 flex items-center justify-center"
              imgClassName="w-full h-full xs:h-fit md:h-full md:w-fit xs:aspect-[2/3] object-cover object-center xs:rounded-lg"
              width={item.thumb_image.data.attributes.width}
              height={item.thumb_image.data.attributes.height}
              src={MediaUrl(item.thumb_image.data.attributes.url)}
              alt={item.thumb_image.data.attributes.alternativeText ?? ''}
              title={item.title ?? ''}
            // sizes="100vw (min-width: 768px) 70vw"
            />
            <div className="hidden xs:flex flex-col items-start flex-1 gap-2 lg:gap-3">
              {item.featured &&
                <span className="w-fit max-w-full bg-primary-600 text-white rounded-full px-2 py-1 truncate">
                  {item.featured_tag_text}
                </span>
              }
              <h3 className="line-clamp-3 text-sm text-left lg:text-base text-primary-600">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </CarouselThumbs>
    </div>
  );

  return (
    <section className="w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl">
      <div className="relative w-full flex flex-col md:flex-row shadow-2xl rounded-3xl">
        <EmblaCarousel
          className="w-full md:w-3/4 shrink-0 rounded-tr-3xl rounded-tl-3xl md:rounded-tr-none md:rounded-l-3xl overflow-hidden"
          containerClassName="w-full"
          options={{ loop: true, containScroll: 'trimSnaps', watchDrag: false }}
          autoplay={false} //temp false
          autoplayOptions={{
            delay: 5000,
            stopOnInteraction: false,
          }}
          otherChildrens={thumbs}
        >
          {items.map((item, index) => (
            <CarouselItem key={item.id}
              index={index}
              className="relative w-full aspect-square xs:aspect-video mr-3 lg:mr-6"
            >
              <Image
                className="h-full w-full object-center object-cover"
                width={item.image.data.attributes.width}
                height={item.image.data.attributes.height}
                src={MediaUrl(item.image.data.attributes.url)}
                alt={item.image.data.attributes.alternativeText ?? ''}
                sizes="100vw (min-width: 768px) 70vw"
                priority={index === 0}
              />
              <div className="absolute inset-0 text-white no-underline"> {/*  bg-gradient-to-tr from-carbon-900/50 to-80% to-transparent */}
                {item.featured && <p className="p-2 px-3 absolute bg-primary-600 top-0 inset-x-0 line-clamp-2">{item.featured_text}</p>}
                <span className="absolute bottom-0 inset-x-0 p-3 lg:p-6">
                  <RemoteMDX source={item.description} />
                </span>
              </div>
            </CarouselItem>
          ))}
        </EmblaCarousel>
      </div>
    </section >
  )
}

export default CarouselAlt;