'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ReactNode, useCallback, useEffect, useState } from 'react';

import clsxm from '@/lib/clsxm';

import { useCarouselContext } from '@/components/elements/carousel/EmblaCarousel';

const CarouselThumbs = (props: {
  children?: ReactNode[];
  className?: string;
  containerClassName?: string;
  thumbClassName?: string;
  activeClassName?: string;
  options?: unknown;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { carouselApi: emblaApi } = useCarouselContext();
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel(
    props.options ?? {}
  );

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi || !emblaThumbsApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaApi.selectedScrollSnap());
  }, [emblaApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <>
      {props.children && (
        <div
          ref={emblaThumbsRef}
          className={clsxm('overflow-hidden', props.className)}
        >
          <div className={clsxm('flex', props.containerClassName)}>
            {props.children.map((thumb, index) => (
              <button
                key={index}
                className={clsxm(
                  'flex-shrink-0 flex-grow-0',
                  selectedIndex === index && props.activeClassName,
                  props.thumbClassName
                )}
                onClick={() => onThumbClick(index)}
              >
                {thumb}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CarouselThumbs;
