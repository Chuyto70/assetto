'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';

import clsxm from '@/lib/clsxm';

import { useCarouselContext } from '@/components/elements/carousel/EmblaCarousel';

const CarouselItem = (props: {
  index: number;
  children?: ReactNode;
  className?: string;
  nxSelectedClassName?: string;
  selectedClassName?: string;
  selectedClassNames?: string;
  nX?: number;
  nxSelectedClassNames?: string;
  wrapperClassNames?: string;
}) => {
  const { carouselApi } = useCarouselContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = carouselApi?.scrollSnapList().length || 0;
  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === totalSlides - 1;

  const isNxSelected =
    Math.abs(currentIndex - props.index) <= (props.nX ?? 0) ||
    currentIndex === props.index ||
    (isFirstSlide && (props.nX ?? 0 > 0) && (props.index === 0 || props.index === totalSlides - 1)) ||
    (isLastSlide && (props.nX ?? 0 > 0) && (props.index === 0 || props.index === totalSlides - 1));

  const onSelect = useCallback(() => {
    if (!carouselApi) return;
    setCurrentIndex(carouselApi.selectedScrollSnap());
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    onSelect();
    carouselApi.on('select', onSelect);
    carouselApi.on('reInit', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
      carouselApi.off('reInit', onSelect);
    };
  }, [carouselApi, onSelect]);

  return (
    <div
      className={clsxm(
        'flex-shrink-0 flex-grow-0',
        props.className,
        isNxSelected && props.nxSelectedClassName,
        currentIndex === props.index && props.selectedClassName
      )}
    >
      <div
        className={clsxm(
          'h-full w-full',
          props.wrapperClassNames,
          isNxSelected && props.nxSelectedClassNames,
          currentIndex === props.index && props.selectedClassNames
        )}
      >
        {props.children}
      </div>
    </div>
  );
};

export default CarouselItem;
