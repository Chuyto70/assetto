'use client';

import dynamic from 'next/dynamic';

import Toast from '@/components/elements/toast/Toast';

import { useToaster } from '@/store/toasterStore';

const AnimatePresence = dynamic(() =>
  import('framer-motion').then((mod) => mod.AnimatePresence)
);
const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div)
);

const Toasts = () => {
  const toasts = useToaster((state) => state.notifications);
  const closeToast = useToaster((state) => state.close);

  return (
    <div className='fixed z-50 flex w-full flex-col items-center gap-4'>
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <MotionDiv
            key={toast.id}
            initial={{ y: -500, opacity: 0, scale: 0 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -500, opacity: 0, scale: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Toast close={() => closeToast(toast.id)} type={toast.type}>
              {toast.message}
            </Toast>
          </MotionDiv>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toasts;
