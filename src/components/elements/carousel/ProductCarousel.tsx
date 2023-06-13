'use client';

import useEmblaCarousel from 'embla-carousel-react';

import clsxm from '@/lib/clsxm';
import { MediaUrl } from '@/lib/helper';
import { Product } from '@/lib/interfaces';

import NextImage from '@/components/NextImage';

type MediaType = Pick<Product['attributes']['medias'], 'data'>;

const ProductCarousel = ({
  medias,
  className,
  imgSizes,
}: {
  medias: MediaType;
  className: string | undefined;
  imgSizes?: string;
}) => {
  const [emblaRef] = useEmblaCarousel({ loop: true });
  return (
    <div className={clsxm('overflow-hidden', className)} ref={emblaRef}>
      <div className='flex h-full'>
        {medias.data.map((media, index) => {
          if (media.attributes.mime.startsWith('image/')) {
            return (
              <NextImage
                key={media.attributes.url + index}
                useSkeleton
                src={MediaUrl(media.attributes.url)}
                width={media.attributes.width}
                height={media.attributes.height}
                alt={media.attributes.alternativeText ?? ''}
                className='mr-1 w-full min-w-0 flex-[0_0_100%]'
                imgClassName='object-cover w-full h-full'
                sizes={imgSizes}
              />
            );
          }
          if (media.attributes.mime.startsWith('video/')) {
            return (
              <video
                key={media.attributes.url + index}
                autoPlay={true}
                muted={true}
                loop={true}
                width={media.attributes.width}
                height={media.attributes.height}
                className={clsxm(
                  (className = 'mr-1 w-full min-w-0 flex-[0_0_100%]'),
                  'h-full object-cover'
                )}
              >
                <source
                  src={MediaUrl(media.attributes.url)}
                  type={media.attributes.mime}
                />
                <meta itemProp='name' content={media.attributes.name} />
                <meta
                  itemProp='description'
                  content={media.attributes.alternativeText}
                />
              </video>
            );
          }
        })}
      </div>
    </div>
  );
};

export default ProductCarousel;
