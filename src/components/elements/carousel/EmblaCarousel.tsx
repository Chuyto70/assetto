'use client';

import Autoplay from 'embla-carousel-autoplay';
import { OptionsType } from 'embla-carousel-autoplay/components/Options';
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';
import { createContext, ReactNode, useContext } from 'react';

import clsxm from '@/lib/clsxm';

const CarouselContext = createContext<{
  carouselApi?: EmblaCarouselType;
}>({});

export const useCarouselContext = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarouselContext must be used within a EmblaCarousel');
  }
  return context;
};

const EmblaCarousel = (props: {
  children: ReactNode;
  otherChildrens?: ReactNode;
  className?: string;
  containerClassName?: string;
  options?: Partial<OptionsType>;
  autoplay?: boolean;
  autoplayOptions?: unknown;
}) => {
  const plugins = [];

  if (props.autoplay) {
    plugins.push(Autoplay(props.autoplayOptions ?? {}));
  }

  const [emblaRef, emblaApi] = useEmblaCarousel(props.options ?? {}, plugins);

  return (
    <CarouselContext.Provider value={{ carouselApi: emblaApi }}>
      <div ref={emblaRef} className={clsxm('overflow-hidden', props.className)}>
        <div className={clsxm('flex', props.containerClassName)}>
          {props.children}
        </div>
      </div>

      {props.otherChildrens}
    </CarouselContext.Provider>
  );
};

export default EmblaCarousel;
