'use client';

import { AnimatePresence, motion } from 'framer-motion';

import Toast from '@/components/elements/toast/Toast';

import { useToaster } from '@/store/toasterStore';

const Toasts = () => {
  const toasts = useToaster((state) => state.notifications);
  const closeToast = useToaster((state) => state.close);

  return (
    <div className='absolute z-50 flex w-full flex-col items-center gap-4'>
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ y: -500, opacity: 0, scale: 0 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -500, opacity: 0, scale: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Toast close={() => closeToast(toast.id)} type={toast.type}>
              {toast.message}
            </Toast>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toasts;
