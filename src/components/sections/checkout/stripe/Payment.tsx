'use client';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { FormEvent, useEffect, useState } from 'react';

import Button from '@/components/elements/buttons/Button';

import { useCart } from '@/store/cartStore';

const Payment = () => {
  const stripeClientSecret = useCart((state) => state.stripeClientSecret);

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

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/complete',
      },
    });

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('!An unexpected error occurred.');
    }

    setIsLoading(false);
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
