'use client';

import Autoplay from 'embla-carousel-autoplay';
import { OptionsType } from 'embla-carousel-autoplay/components/Options';
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import clsxm from '@/lib/clsxm';

const CarouselContext = createContext<
  | {
    carouselApi: EmblaCarouselType | undefined;
    thumbsApi: EmblaCarouselType | undefined;
  }
  | undefined
  | null
>(null);

export const useCarouselContext = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarouselContext must be used within a EmblaCarousel');
  }
  return context;
};

const EmblaCarousel = (props: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  options?: Partial<OptionsType>;
  autoplay?: boolean;
  autoplayOptions?: unknown;
  thumbsChildren?: ReactNode[];
  thumbsClassName?: string;
  thumbsContainerClassName?: string;
  thumbClassName?: string;
  activeThumbClassName?: string;
  thumbOptions?: Partial<OptionsType>;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplay = props.autoplay
    ? [Autoplay(props.autoplayOptions ?? {})]
    : [];
  const [emblaRef, emblaApi] = useEmblaCarousel(props.options ?? {}, autoplay);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel(
    props.thumbOptions ?? {}
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
    <CarouselContext.Provider
      value={{ carouselApi: emblaApi, thumbsApi: emblaThumbsApi }}
    >
      <div ref={emblaRef} className={clsxm('overflow-hidden', props.className)}>
        <div className={clsxm('flex', props.containerClassName)}>
          {props.children}
        </div>
      </div>

      {props.thumbsChildren && (
        <div
          ref={emblaThumbsRef}
          className={clsxm('overflow-hidden', props.thumbsClassName)}
        >
          <div className={clsxm('flex', props.thumbsContainerClassName)}>
            {props.thumbsChildren.map((thumb, index) => (
              <button
                key={index}
                className={clsxm(
                  'flex-shrink-0 flex-grow-0',
                  selectedIndex === index && props.activeThumbClassName,
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
    </CarouselContext.Provider>
  );
};

export default EmblaCarousel;
