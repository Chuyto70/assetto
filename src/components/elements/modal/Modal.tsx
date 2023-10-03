'use client';

import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';

import clsxm from '@/lib/clsxm';

const AnimatePresence = dynamic(() => import("framer-motion").then((mod) => mod.AnimatePresence));
const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div)
);

export default function Modal({ children, className, dismissBack = false, dismissAction }: { children: React.ReactNode; className?: string, dismissBack?: boolean; dismissAction?: () => void; }) {
  const overlay = useRef(null);
  const wrapper = useRef(null);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [openPath, setOpenPath] = useState<string | null>();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const overlayVariants = {
    open: {
      opacity: 1,
    },
    closed: {
      opacity: 0,
    }
  };

  const wrapperVariants = {
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.3,
      }
    },
    closed: {
      opacity: 0,
      scale: 0,
      transition: {
        type: "spring",
        duration: 0.3,
      }
    }
  };

  const onDismiss = useCallback(() => {
    if (openPath !== `${pathname}?${searchParams}`) return;
    dismissBack && router.back();
    dismissAction !== undefined && dismissAction();
  }, [openPath, pathname, searchParams, dismissBack, router, dismissAction]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (isOpen) setIsOpen(false);
      }
    },
    [isOpen, overlay, wrapper]
  );

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    !openPath && setOpenPath(`${pathname}?${searchParams}`);
    if (openPath && openPath !== `${pathname}?${searchParams}`) setIsOpen(false);
  }, [openPath, pathname, searchParams]);

  return (
    <AnimatePresence
      onExitComplete={onDismiss}
    >
      {isOpen && <MotionDiv
        initial={overlayVariants.closed}
        animate={overlayVariants.open}
        exit={overlayVariants.closed}
        className="fixed z-50 left-0 right-0 top-0 bottom-0 mx-auto bg-carbon-900/60"
      >
        <div
          ref={overlay}
          onClick={onClick}
          className='w-full h-full'
        >

          <div
            ref={wrapper}
            className={clsxm("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-full sm:w-10/12 max-w-screen-lg max-h-screen",
              "overflow-y-scroll no-scrollbar p-6", className)}
          >
            <MotionDiv
              initial={wrapperVariants.closed}
              animate={wrapperVariants.open}
              exit={wrapperVariants.closed}
              className='h-full w-full'
            >
              {children}
            </MotionDiv>
          </div>
        </div>
      </MotionDiv>}
    </AnimatePresence>
  )
}