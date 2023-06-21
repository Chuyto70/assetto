'use client';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { StripeError } from '@stripe/stripe-js';
import { FormEvent, useEffect, useState } from 'react';

import logger from '@/lib/logger';

import Button from '@/components/elements/buttons/Button';

import { useCart } from '@/store/cartStore';

const Payment = () => {
  const stripeClientSecret = useCart((state) => state.stripeClientSecret);
  const stripePaymentIntentId = useCart((state) => state.stripePaymentIntentId);

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!stripeClientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(stripeClientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case 'succeeded':
            setMessage('!Payment succeeded!');
            break;
          case 'processing':
            setMessage('!Your payment is processing.');
            break;
          case 'requires_payment_method':
            setMessage('!Your payment was not successful, please try again.');
            break;
          default:
            setMessage('!Something went wrong.');
            break;
        }
      });
  }, [stripe, stripeClientSecret]);

  const handleErrors = (error: StripeError) => {
    switch (error.type) {
      case 'card_error':
        setMessage(error.message);
        break;
      case 'validation_error':
        setMessage(error.message);
        break;
      case 'rate_limit_error':
        setMessage('!Rate limited, please try again later');
        break;
      default:
        setMessage('!An unexpected error occurred.');
        break;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleErrors(submitError);
      setIsLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
    });

    if (error) {
      handleErrors(error);
      setIsLoading(false);
      return;
    }

    const res = await fetch('http://localhost:3000/api/confirm-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'same-origin',
      body: JSON.stringify({
        payment_intent_id: stripePaymentIntentId,
        payment_method: paymentMethod.id,
      }),
      cache: 'no-store',
    }); //! edit url

    const data = await res.json();
    logger(data);
  };

  return (
    <>
      <PaymentElement options={{ layout: 'accordion' }} />
      <Button isLoading={isLoading} onClick={handleSubmit}>
        !Pay
      </Button>
      <p>{message}</p>
    </>
  );
};

export default Payment;
