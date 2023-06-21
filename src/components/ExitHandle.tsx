'use client';

import { useEffect } from 'react';

import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';

import { abandonPaymentIntent } from '@/actions/stripe/paymentIntents';

const ExitHandle = () => {
  const stripePaymentIntentId = useCart((state) => state.stripePaymentIntentId);
  const paymentProvider = useServer.getState().paymentProvider;

  useEffect(() => {
    const handleWindowClose = () => {
      if (stripePaymentIntentId) {
        if (paymentProvider === 'STRIPE')
          abandonPaymentIntent(stripePaymentIntentId);
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
