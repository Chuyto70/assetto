import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

import { gql, QueryContentComponent } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";
import { Media } from "@/lib/interfaces";

import CarouselItem from "@/components/elements/carousel/CarouselItem";
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
  page: {
    data: {
      attributes: {
        content: {
          items: {
            id: number;
            title: string;
            description: string;
            image: {
              data: Media;
            }
            href: string;
          }[];
        }[];
      };
    };
  };
};


const Carousel = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsCarousel, 'sectionsCarousel');
  const { items } = content[props.index];

  const thumbs = items.map((item) => (
    <div key={item.id}
      className="relative w-full h-full"
    >
      <Image
        className="h-full w-full object-center object-cover brightness-75"
        width={item.image.data.attributes.width}
        height={item.image.data.attributes.height}
        src={MediaUrl(item.image.data.attributes.url)}
        alt={item.image.data.attributes.alternativeText ?? ''}
        sizes="100vw (min-width: 768px) 70vw"
      />
      <h3 className="absolute bottom-0 left-0 w-full line-clamp-2 text-center p-3 lg:p-6 text-sm lg:text-base text-primary-600">
        {item.title}
      </h3>
    </div>
  ));

  return (
    <section className="w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl">
      <div className="relative w-full flex flex-col md:flex-row gap-3 lg:gap-6">
        <EmblaCarousel
          className="w-full md:w-3/4 md:pr-3 lg:pr-6 shrink-0"
          containerClassName="w-full"
          options={{ loop: true, containScroll: 'trimSnaps', }}
          autoplay={false}
          autoplayOptions={{
            delay: 5000,
            stopOnInteraction: false,
          }}
          thumbsChildren={thumbs}
          thumbOptions={{
            containScroll: 'keepSnaps',
            dragFree: true,
            breakpoints: {
              '(min-width: 768px)': { axis: 'y' }
            }
          }}
          thumbsClassName="md:absolute right-0 md:w-1/4 md:h-full"
          thumbsContainerClassName="md:flex-col md:h-full"
          thumbClassName="aspect-video w-1/2 xs:w-1/3 md:w-full md:max-h-1/4 rounded-3xl overflow-hidden mr-3 last:mr-0 md:mr-0 md:mb-3 lg:mb-6 md:last:mb-0"
          activeThumbClassName="border-2 border-primary-600"
        >
          {items.map((item) => (
            <CarouselItem key={item.id}
              className="relative w-full aspect-square xs:aspect-video rounded-3xl overflow-hidden mr-3 lg:mr-6"
            >
              <Image
                className="h-full w-full object-center object-cover brightness-75"
                width={item.image.data.attributes.width}
                height={item.image.data.attributes.height}
                src={MediaUrl(item.image.data.attributes.url)}
                alt={item.image.data.attributes.alternativeText ?? ''}
                sizes="100vw (min-width: 768px) 70vw"
              />
              <div className="absolute bottom-0 left-0 p-3 lg:p-6 text-white no-underline">
                {item.href ? <Link href={item.href}>
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