'use client';

import { useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

const StripeComplete = ({ cartPage }: { cartPage?: string }) => {
  const router = useRouter();
  const stripe = useStripe();

  const notify = useToaster.getState().notify;

  const translations = useServer.getState().translations;

  const stripeClientSecret = useCart((state) => state.stripeClientSecret);

  useEffect(() => {
    if (!stripe) return;
    if (!stripeClientSecret) {
      router.push(cartPage ?? '/');
      return;
    }

    stripe
      .retrievePaymentIntent(stripeClientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case 'succeeded':
            //
            break;
          case 'processing':
            //
            break;
          case 'requires_payment_method':
            notify(
              1,
              <p>{translations.payment.requires_payment_method}</p>,
              6000
            );
            router.push(cartPage ?? '/');
            break;
          default:
            //
            break;
        }
      });
  }, [cartPage, notify, router, stripe, stripeClientSecret, translations]);

  return <div>Complete</div>;
};

export default StripeComplete;
