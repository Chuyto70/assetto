import { ReactNode } from "react";

import clsxm from "@/lib/clsxm";

const CarouselItem = (props: { children?: ReactNode; className?: string; }) => {
  return (
    <div className={clsxm('flex-shrink-0 flex-grow-0', props.className)}>
      {props.children}
    </div>
  )
}

export default CarouselItem;