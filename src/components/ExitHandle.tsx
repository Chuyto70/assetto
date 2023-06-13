'use client';

import { useEffect } from 'react';

import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';

import { stripe_abandon_payment_intent } from '@/actions/stripeCheckoutActions';

const ExitHandle = () => {
  const stripePaymentIntentId = useCart((state) => state.stripePaymentIntentId);
  const paymentProvider = useServer.getState().paymentProvider;

  useEffect(() => {
    const handleWindowClose = () => {
      if (stripePaymentIntentId) {
        if (paymentProvider === 'STRIPE') {
          stripe_abandon_payment_intent(stripePaymentIntentId);
        }
      }
      return;
    };
    window.addEventListener('beforeunload', handleWindowClose);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, [stripePaymentIntentId, paymentProvider]);

  return null;
};

export default ExitHandle;
