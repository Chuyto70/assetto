"use client";

import dynamic from "next/dynamic";
import { Children, ReactNode } from "react";

import clsxm from "@/lib/clsxm";

const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div)
);

const FramerInfinite = ({ children, className, speed = 1, leftToRight = false }: { children: ReactNode, className?: string; speed?: number; leftToRight?: boolean }) => {
  const extendedChildren = [children, children];
  const extendedChildCount = Children.count(extendedChildren);

  return (
    <MotionDiv className={clsxm('flex w-fit', className)}
      initial={{ x: leftToRight ? '50%' : '0%' }}
      animate={{ x: leftToRight ? '100%' : '-50%' }}
      exit={{ x: leftToRight ? '100%' : '-50%' }}
      style={{
        transformOrigin: '50% 0',
      }}
      transition={{ ease: 'linear', duration: extendedChildCount * (1 / speed), repeat: Infinity, repeatType: 'loop' }}
    >
      {extendedChildren}
    </MotionDiv>
  )
}

export default FramerInfinite;