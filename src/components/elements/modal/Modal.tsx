'use client';

import { useRouter } from 'next/navigation';
import { MouseEventHandler, useCallback, useEffect, useRef } from 'react';

export default function Modal({ children, dismissBack = false, dismissAction }: { children: React.ReactNode; dismissBack?: boolean; dismissAction?: () => void; }) {
  const overlay = useRef(null)
  const wrapper = useRef(null)
  const router = useRouter()

  const onDismiss = useCallback(() => {
    dismissBack && router.back();
    dismissAction !== undefined && dismissAction();
  }, [dismissBack, router, dismissAction]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown])

  return (
    <div
      ref={overlay}
      className="fixed z-50 left-0 right-0 top-0 bottom-0 mx-auto bg-carbon-900/60"
      onClick={onClick}
    >
      <div
        ref={wrapper}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:w-10/12 md:w-8/12 lg:w-1/2 max-w-screen-lg max-h-screen overflow-y-scroll no-scrollbar p-6"
      >
        {children}
      </div>
    </div>
  )
}