'use client';

import { PaymentIntentResult, Stripe } from '@stripe/stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import { QueryOrderFromPaymentIntent } from '@/lib/graphql';
import { Order } from '@/lib/interfaces';

import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

const StripeComplete = ({ cartPage }: { cartPage?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading...');
  const [order, setOrder] = useState<Order>();
  const stripePaymentIntentId = searchParams.get('payment_intent');
  const stripeClientSecret = useRef(
    searchParams.get('payment_intent_client_secret') ??
      useCart.getState().stripeClientSecret
  );

  const notify = useToaster.getState().notify;

  const translations = useServer.getState().translations;

  const setStripeClientSecret = useCart((state) => state.setStripeClientSecret);
  const setStripePaymentIntentId = useCart(
    (state) => state.setStripePaymentIntentId
  );
  const emptyCart = useCart.getState().emptyCart;

  const handlePaymentIntent = useCallback(
    ({ paymentIntent }: PaymentIntentResult) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setStatus(translations.payment.succeeded);
          QueryOrderFromPaymentIntent(paymentIntent.id)
            .then((res) => setOrder(res.data[0]))
            .catch(() => notify(1, <p>{translations.order.error_fetching}</p>));
          emptyCart();
          break;
        case 'processing':
          setStatus(translations.payment.processing);
          QueryOrderFromPaymentIntent(paymentIntent.id)
            .then((res) => setOrder(res.data[0]))
            .catch(() => notify(1, <p>{translations.order.error_fetching}</p>));
          emptyCart();
          break;
        case 'requires_payment_method':
          if (stripePaymentIntentId)
            setStripePaymentIntentId(stripePaymentIntentId);
          if (stripeClientSecret.current)
            setStripeClientSecret(stripeClientSecret.current);
          notify(
            1,
            <p>{translations.payment.requires_payment_method_after_failed}</p>,
            6000
          );
          router.push(cartPage ?? '/');
          break;
        default:
          break;
      }
    },
    [
      cartPage,
      emptyCart,
      notify,
      router,
      setStripeClientSecret,
      setStripePaymentIntentId,
      stripePaymentIntentId,
      translations,
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
      if (!stripeClientSecret.current) {
        router.push(cartPage ?? '/');
        return;
      }

      stripe
        .retrievePaymentIntent(stripeClientSecret.current)
        .then(handlePaymentIntent);
    });
  }, [cartPage, handlePaymentIntent, router]);

  return (
    <div>
      <h2>{status}</h2>
      <p>
        {translations.order.total_amount} : {order?.attributes.amount}€
      </p>
      <ul>
        {order?.attributes.products.map((product, index) => (
          <li key={index}>
            <p>
              {product.title} - {product.color}
            </p>
            <p>
              {translations.size} : {product.size}
            </p>
            <p>
              {product.price}€ {product.qty > 1 && `x ${product.qty}`}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StripeComplete;
