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
import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

import { deploymentURL } from '@/constant/env';

const StripePayment = ({
  cart_page,
  return_url,
}: {
  cart_page: string;
  return_url: string;
}) => {
  const router = useRouter();

  const stripeClientSecret = useCart((state) => state.stripeClientSecret);
  const stripePaymentIntentId = useCart((state) => state.stripePaymentIntentId);
  const refreshCart = useCart((state) => state.refreshCart);

  const notify = useToaster((state) => state.notify);

  const translations = useServer.getState().translations;

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleErrors = (
    error: StripeError | { type: string; message?: string }
  ) => {
    switch (error.type) {
      case 'card_error':
        setMessage(error.message);
        break;
      case 'validation_error':
        setMessage(error.message);
        break;
      case 'rate_limit_error':
        setMessage(translations.payment.rate_limit_error);
        break;
      case 'no-payment-intent':
        notify(2, <p>{translations.payment.no_payment_intent}</p>);
        router.push(cart_page);
        break;
      case 'no-payment-method':
        setMessage(translations.payment.requires_payment_method);
        break;
      case 'cannot-confirm-order':
        setMessage(translations.payment.cannot_confirm_order);
        break;
      case 'no-valid-cart':
        refreshCart();
        notify(2, <p>{translations.error.cart_not_equal_updated}</p>);
        router.push(cart_page);
        break;
      default:
        setMessage(translations.payment.unexpected);
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
      setIsLoading(false);
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
        {translations.payment.pay_btn}
      </Button>
      <p>{message}</p>
    </>
  );
};

export default StripePayment;
