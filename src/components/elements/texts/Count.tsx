'use client';

import { useInView, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

import { toFixedNumber } from "@/lib/helper";

export default function Count({
  children,
  className,
  value,
}: {
  children?: ReactNode;
  className?: string;
  value: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inViewRef = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 100,
  });
  const isInView = useInView(inViewRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = toFixedNumber(latest, 0).toString();
        }
      }),
    [springValue]
  );

  return <span ref={inViewRef} className={className}>
    {isInView ? <span ref={ref} /> : children}
  </span>;
}