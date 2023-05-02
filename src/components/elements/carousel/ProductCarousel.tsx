'use client';

import useEmblaCarousel from 'embla-carousel-react';

import style from './ProductCarousel.module.css';

import clsxm from '@/lib/clsxm';
import { graphQLProductProps } from '@/lib/graphql';
import { MediaUrl } from '@/lib/helper';

import NextImage from '@/components/NextImage';

type MediaType = Pick<
  graphQLProductProps['product']['data']['attributes']['medias'],
  'data'
>;

export default function ProductCarousel({
  medias,
  className,
}: {
  medias: MediaType;
  className: string | undefined;
}) {
  const [emblaRef] = useEmblaCarousel({ loop: true });

  return (
    <div className={clsxm(style.embla, className)} ref={emblaRef}>
      <div className={style.embla__container}>
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
                className={clsxm(style.embla__slide, 'w-full')}
                imgClassName='object-cover w-full h-full'
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
                  style.embla__slide,
                  'h-full w-full object-cover'
                )}
              >
                <source
                  src={MediaUrl(media.attributes.url)}
                  type={media.attributes.mime}
                />
              </video>
            );
          }
        })}
      </div>
    </div>
  );
}

// TODO: Optimize NextImage size
