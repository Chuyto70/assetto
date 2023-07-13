import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";

import { gql, QueryContentComponent } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";

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
              data: {
                attributes: {
                  alternativeText: string;
                  caption: string;
                  url: string;
                  width: number;
                  height: number;
                }
              }
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
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', 'page', ComponentSectionsCarousel, 'sectionsCarousel');
  const { items } = content[props.index];

  return (
    <section className="mx-3">
      <EmblaCarousel
        options={{ loop: true, containScroll: 'trimSnaps', }}
        autoplay={false}
        autoplayOptions={{
          delay: 5000,
          stopOnInteraction: false,
        }}
      >
        {items.map((item) => (
          <CarouselItem key={item.id}
            className="relative w-full aspect-square xs:aspect-video rounded-3xl overflow-hidden mr-3"
          >
            <Image
              className="h-full w-full object-center object-cover brightness-75"
              width={item.image.data.attributes.width}
              height={item.image.data.attributes.height}
              src={MediaUrl(item.image.data.attributes.url)}
              alt={item.image.data.attributes.alternativeText}
              sizes="100vw (min-width: 768px) 70vw"
            />
            <div className="absolute bottom-0 left-0 p-3 text-white no-underline">
              {item.href ? <Link href={item.href}>
                <MDXRemote source={item.description} />
              </Link> : <MDXRemote source={item.description} />}
            </div>
          </CarouselItem>
        ))}
      </EmblaCarousel>
    </section>
  )
}

export default Carousel;