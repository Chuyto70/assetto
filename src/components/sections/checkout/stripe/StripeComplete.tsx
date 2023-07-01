'use client';

import { PaymentIntentResult, Stripe } from '@stripe/stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

const StripeComplete = ({ cartPage }: { cartPage?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stripeClientSecret =
    searchParams.get('payment_intent_client_secret') ??
    useCart.getState().stripeClientSecret;

  const notify = useToaster.getState().notify;

  const translations = useServer.getState().translations;

  const emptyCart = useCart.getState().emptyCart;

  const handlePaymentIntent = useCallback(
    ({ paymentIntent }: PaymentIntentResult) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          notify(0, 'succeeded', 10000);
          emptyCart();
          break;
        case 'processing':
          notify(0, 'processing', 1000);
          emptyCart();
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
          notify(0, 'skeletton', 10000);
          break;
      }
    },
    [
      cartPage,
      emptyCart,
      notify,
      router,
      translations.payment.requires_payment_method,
    ]
  );

  useEffect(() => {
    async function fetchStripe(): Promise<Stripe | null> {
      const stripePromise = (await import('@stripe/stripe-js')).loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
      );
      const stripe = await stripePromise;
      return stripe;
    }
    fetchStripe().then((stripe) => {
      if (!stripe) return;
      if (!stripeClientSecret) {
        router.push(cartPage ?? '/');
        return;
      }

      stripe
        .retrievePaymentIntent(stripeClientSecret)
        .then(handlePaymentIntent);
    });
  }, [cartPage, handlePaymentIntent, router, stripeClientSecret]);

  return <div>Complete</div>;
};

export default StripeComplete;
