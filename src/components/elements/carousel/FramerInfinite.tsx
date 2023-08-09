"use client";

import { useInView, Variants } from "framer-motion";
import dynamic from "next/dynamic";
import { Children, ReactNode, useRef } from "react";

import clsxm from "@/lib/clsxm";

const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div)
);

const FramerInfinite = ({ children, className, speed = 1, leftToRight = false }: { children: ReactNode, className?: string; speed?: number; leftToRight?: boolean }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false })
  const extendedChildren = [children, children];
  const extendedChildCount = Children.count(extendedChildren);

  const variants: Variants = {
    stopped: { x: leftToRight ? '-50%' : '0%' },
    scrolling: {
      x: leftToRight ? '0%' : '-50%',
      transition: {
        ease: 'linear', duration: extendedChildCount * (1 / speed), repeat: Infinity, repeatType: 'loop'
      }
    },
    exit: { x: leftToRight ? '0%' : '-50%' },
  };

  return (
    <>
      <span ref={ref}></span>
      <MotionDiv className={clsxm('flex w-fit', className)}
        initial='stopped'
        animate={isInView ? 'scrolling' : 'stopped'}
        exit='exit'
        variants={variants}
      >
        {extendedChildren}
      </MotionDiv>
    </>

  )
}

export default FramerInfinite;