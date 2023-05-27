'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useStore } from 'zustand';

import Button from '@/components/elements/buttons/Button';
import Cart from '@/components/sections/cart/Cart';
import StripeCheckout from '@/components/sections/cart/StripeCheckout';

import { useCart } from '@/store/cartStore';

import { create_strapi_order, stripe_payment_intent } from '@/actions/actions';

export default function CartWrapper() {
  const cartItems = useStore(useCart, (state) => state.cartItems);
  const setClientSecret = useCart((state) => state.setClientSecret);
  const clientSecret = useCart((state) => state.clientSecret);
  const [step, setStep] = useState(0);
  const [cartValidated, setCartValidated] = useState(false);

  const changeStep = (step: number) => {
    if (step >= 0 && step <= 1) setStep(step);
  };

  const validateCart = () => {
    setCartValidated(true);
    create_strapi_order(cartItems)
      .then((res) => {
        if (!res.error && res.data?.total) {
          stripe_payment_intent(res.data.total).then((res) => {
            res && setClientSecret(res);
          });
        } else {
          setCartValidated(false);
        }
      })
      .catch(() => setCartValidated(false)); //! handle errors
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
      stripe intent : {clientSecret}
      <Button onClick={() => changeStep(step - 1)}>!RETOUR</Button>
      <Button disabled={cartValidated} onClick={validateCart}>
        !VALIDER MON PANIER
      </Button>
    </>
  );
}
