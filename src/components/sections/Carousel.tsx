import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

import { gql, QueryContentComponent } from "@/lib/graphql";
import { includeLocaleLink, MediaUrl } from "@/lib/helper";
import { UploadFile } from "@/lib/interfaces";

import CarouselBtn from "@/components/elements/carousel/CarouselBtn";
import CarouselItem from "@/components/elements/carousel/CarouselItem";
import CarouselThumbs from "@/components/elements/carousel/CarouselThumbs";
import EmblaCarousel from "@/components/elements/carousel/EmblaCarousel";

import { useServer } from "@/store/serverStore";

const ComponentSectionsCarousel = gql`
  fragment sectionsCarousel on ComponentSectionsCarousel {
    items {
      id
      title
      description
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
      href
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
          image: {
            data: UploadFile;
          }
          href: string;
        }[];
      }[];
    };
  };
};


const Carousel = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsCarousel, 'sectionsCarousel');
  const { items } = content[props.index];

  const thumbs = (
    <div className="md:absolute md:w-1/4 right-0 md:h-full md:py-6">
      <CarouselBtn icon="ic:round-chevron-left" className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 z-10 text-3xl text-primary-600" />
      <CarouselThumbs
        className="relative rounded-3xl overflow-hidden md:w-full md:h-full"
        containerClassName="md:flex-col md:h-full"
        thumbClassName="aspect-video w-1/2 xs:w-1/3 md:w-full md:max-h-1/4 rounded-3xl overflow-hidden mr-3 last:mr-0 md:mr-0 md:mb-3 lg:mb-6 md:last:mb-0"
        activeClassName="border-2 border-primary-600"
        options={{
          containScroll: 'keepSnaps',
          dragFree: true,
          breakpoints: {
            '(min-width: 768px)': { axis: 'y' }
          }
        }}
      >
        {items.map((item) => (
          <div key={item.id}
            className="relative w-full h-full"
          >
            <Image
              className="h-full w-full object-center object-cover"
              width={item.image.data.attributes.width}
              height={item.image.data.attributes.height}
              src={MediaUrl(item.image.data.attributes.url)}
              alt={item.image.data.attributes.alternativeText ?? ''}
              sizes="100vw (min-width: 768px) 70vw"
            />
            <h3 className="absolute bottom-3 left-0 w-full line-clamp-1 text-center p-1 lg:p-3 text-sm lg:text-base text-primary-600 bg-black/75">
              {item.title}
            </h3>
          </div>
        ))}
      </CarouselThumbs>
      <CarouselBtn isNext icon="ic:round-chevron-left" className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 -rotate-90 z-10 text-3xl text-primary-600" />
    </div>
  );

  return (
    <section className="w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl">
      <div className="relative w-full flex flex-col md:flex-row gap-3 lg:gap-6">
        <EmblaCarousel
          className="w-full md:w-3/4 md:pr-3 lg:pr-6 shrink-0"
          containerClassName="w-full"
          options={{ loop: true, containScroll: 'trimSnaps' }}
          autoplay={true}
          autoplayOptions={{
            delay: 5000,
            stopOnInteraction: false,
          }}
          otherChildrens={thumbs}
        >
          {items.map((item, index) => (
            <CarouselItem key={item.id}
              index={index}
              className="relative w-full aspect-square xs:aspect-video rounded-3xl overflow-hidden mr-3 lg:mr-6"
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
              <div className="absolute w-full bottom-0 left-0 p-3 lg:p-6 text-white no-underline bg-black/75">
                {item.href ? <Link title={item.title} href={includeLocaleLink(item.href)}>
                  <MDXRemote source={item.description} />
                </Link> : <MDXRemote source={item.description} />}
              </div>
            </CarouselItem>
          ))}
        </EmblaCarousel>
      </div>
    </section >
  )
}

export default Carousel;