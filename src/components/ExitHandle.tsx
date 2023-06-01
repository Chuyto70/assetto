'use client';

import { useEffect } from 'react';

import { useCart } from '@/store/cartStore';

import { abandon_payment_intent } from '@/actions/checkoutActions';

const ExitHandle = () => {
  const paymentIntentId = useCart((state) => state.paymentIntentId);

  useEffect(() => {
    const handleWindowClose = () => {
      if (paymentIntentId) abandon_payment_intent(paymentIntentId);
      return;
    };
    window.addEventListener('beforeunload', handleWindowClose);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, [paymentIntentId]);

  return null;
};

export default ExitHandle;
