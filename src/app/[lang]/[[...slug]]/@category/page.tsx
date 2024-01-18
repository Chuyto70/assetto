import clsxm from "@/lib/clsxm";
import { QueryCategoryFromSlug } from "@/lib/graphql";
import { includeLocaleLink, MediaUrl } from "@/lib/helper";

import CarouselItem from "@/components/elements/carousel/CarouselItem";
import EmblaCarousel from "@/components/elements/carousel/EmblaCarousel";
import ButtonLink from "@/components/elements/links/ButtonLink";
import FormatPrice from "@/components/elements/texts/FormatPrice";
import RemoteMDX from "@/components/elements/texts/RemoteMDX";
import NextImage from "@/components/NextImage";
import Sections, { sectionTypeProps } from "@/components/sections";

import notFound from "@/app/[lang]/not-found";

const CategoryPage = async ({
  params: { lang, slug },
}: {
  params: { slug: string[]; lang: string };
}) => {
  const { data } = await QueryCategoryFromSlug(lang, slug);

  if (data.length <= 0) return notFound({ lang, slug });

  const pageID = data[0].id;
  const { title, description, price_text, btn_text, content, products } = data[0].attributes;

  return (
    <>
      <section className="w-full max-w-screen-md px-3 md:px-6 lg:px-12 flex flex-col items-center justify-center gap-3 md:gap-6 text-center">
        <h1 className="italic">{title}</h1>
        <p className="text-carbon-700 dark:text-carbon-400">{description}</p>
      </section>
      {products.data.length > 0 &&
        <section className="w-full max-w-screen-2xl px-3 md:px-6 lg:px-12">
          <div className={clsxm("border-2 dark:border-carbon-white rounded-3xl overflow-hidden",
            products.data.length < 2
              ? '' : products.data.length < 3
                ? 'flex flex-col xs:flex-row divide-y-2 xs:divide-y-0 xs:divide-x-2' : 'flex flex-col md:flex-row divide-y-2 md:divide-y-0 md:divide-x-2'
          )}>
            {products.data.map((product) => (
              <div key={product.id}
                className="w-full flex flex-col xs:flex-row"
              >

                {products.data.length < 2 && <EmblaCarousel
                  className="w-full xs:w-1/3 lg:w-2/3"
                  containerClassName="w-full h-full"
                >
                  {products.data[0].attributes.medias.data.map((media, index) => (
                    <CarouselItem
                      key={media.id}
                      index={index}
                      className="w-full h-full"
                    >
                      <NextImage
                        className='w-full h-full'
                        imgClassName='w-full h-full object-cover object-center'
                        useSkeleton
                        width={media.attributes.width}
                        height={media.attributes.height}
                        src={MediaUrl(media.attributes.url)}
                        alt={media.attributes.alternativeText ?? ''}
                        priority={index === 0}
                      />
                    </CarouselItem>
                  ))}
                </EmblaCarousel>}

                <div
                  className={clsxm("w-full p-3 xs:p-6 flex flex-col gap-3",
                    products.data.length < 2
                      ? 'xs:w-2/3 lg:w-1/3' : products.data.length < 3
                        ? 'lg:items-center lg:p-8' : 'xs:items-center md:items-start lg:p-8'
                  )}
                >
                  <p className="h3">{product.attributes.title}</p>
                  <p className="[&>.price]:text-5xl xs:[&>.price]:text-8xl"><FormatPrice text={price_text} prices={product.attributes.prices} /></p>
                  <hr className={clsxm("border-t-2 rounded-full",
                    products.data.length < 2
                      ? '' : products.data.length < 3
                        ? 'lg:w-2/3' : 'xs:w-2/3 md:w-full'
                  )} />
                  <div className="prose prose-carbon dark:prose-invert dark:prose-dark md:prose-md max-w-full flex-1">
                    <RemoteMDX source={product.attributes.description} />
                  </div>
                  <div className="w-full flex justify-center">
                    <ButtonLink scroll={false} className="md:text-lg font-semibold px-6" title={product.attributes.title} href={includeLocaleLink(`/checkout/${product.attributes.slug}`)}>{btn_text}</ButtonLink>
                  </div>
                </div>
              </div>

            ))}

          </div>
        </section>
      }
      <Sections sections={content as unknown as [sectionTypeProps]} pageID={pageID} pageType="category" />
    </>
  );
};

export default CategoryPage;
