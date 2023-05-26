'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import Button from '@/components/elements/buttons/Button';
import Cart from '@/components/sections/cart/Cart';
import StripeCheckout from '@/components/sections/cart/StripeCheckout';

export default function CartWrapper() {
  const [step, setStep] = useState(0);

  const changeStep = (step: number) => {
    if (step >= 0 && step <= 1) setStep(step);
  };

  return (
    <>
      <AnimatePresence mode='wait' initial={false}>
        {step === 0 && (
          <motion.div
            key={0}
            initial={{ x: -1000, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 1000, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Cart />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key={1}
            initial={{ x: -1000, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 1000, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <StripeCheckout />
          </motion.div>
        )}
      </AnimatePresence>
      <Button onClick={() => changeStep(step - 1)}>!PREVIOUS</Button>
      <Button onClick={() => changeStep(step + 1)}>!NEXT</Button>
    </>
  );
}
