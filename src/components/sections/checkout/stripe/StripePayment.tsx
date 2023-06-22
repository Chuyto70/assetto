'use client';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { StripeError } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import Button from '@/components/elements/buttons/Button';

import { useCart } from '@/store/cartStore';

import { deploymentURL } from '@/constant/env';

const StripePayment = ({ return_url }: { return_url: string }) => {
  const router = useRouter();

  const stripeClientSecret = useCart((state) => state.stripeClientSecret);
  const stripePaymentIntentId = useCart((state) => state.stripePaymentIntentId);

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

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

    const res = await fetch(`${deploymentURL}/api/confirm-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'same-origin',
      body: JSON.stringify({
        payment_intent_id: stripePaymentIntentId,
        payment_method: paymentMethod.id,
        return_url: `${deploymentURL}${return_url}`,
      }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (data.error) {
      handleErrors(data.error);
      return;
    } else if (data.status === 'requires_action') {
      // Use Stripe.js to handle the required next action
      const { error } = await stripe.handleNextAction({
        clientSecret: stripeClientSecret ?? data.client_secret,
      });
      if (error) {
        handleErrors(data.error);
        return;
      }
    }

    router.push(return_url);
    return;
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

export default StripePayment;
