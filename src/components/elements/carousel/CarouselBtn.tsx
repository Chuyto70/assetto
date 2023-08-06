'use client';

import { ReactNode } from "react";

import { useCarouselContext } from "@/components/elements/carousel/EmblaCarousel";
import DynamicIcon from "@/components/elements/DynamicIcon";

const CarouselBtn = (props: { isNext?: boolean; children?: ReactNode; icon?: string; className?: string; iconClassName?: string; iconWrapperClassName?: string }) => {
  const { carouselApi } = useCarouselContext();

  const handleClick = () => {
    if (props.isNext) carouselApi?.scrollNext();
    else carouselApi?.scrollPrev();
  };

  return (
    <button
      className={props.className}
      onClick={handleClick}
    >
      {props.icon && <DynamicIcon icon={props.icon} className={props.iconClassName} wrapperClassName={props.iconWrapperClassName} />}
      {!props.icon && props.children}
    </button>
  )
}

export default CarouselBtn;