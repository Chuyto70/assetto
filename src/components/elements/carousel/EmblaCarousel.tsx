'use client';

import Autoplay from 'embla-carousel-autoplay';
import { OptionsType } from 'embla-carousel-autoplay/components/Options';
import useEmblaCarousel from "embla-carousel-react";
import { ReactNode } from "react";

import clsxm from '@/lib/clsxm';

const EmblaCarousel = (props: { children: ReactNode; className?: string; options?: Partial<OptionsType>; autoplay?: boolean; autoplayOptions?: unknown }) => {

  const autoplay = props.autoplay ? [Autoplay(props.autoplayOptions ?? {})] : [];
  const [emblaRef] = useEmblaCarousel(props.options ?? {}, autoplay);

  return (
    <div ref={emblaRef}
      className={clsxm('overflow-hidden', props.className)}
    >
      <div className="flex">
        {props.children}
      </div>
    </div>
  )
}

export default EmblaCarousel;