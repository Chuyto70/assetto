'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import StripeForm from '@/components/sections/cart/StripeForm';

import { useCart } from '@/store/cartStore';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''
);

const StripeCheckout = () => {
  const clientSecret = useCart((state) => state.clientSecret);

  // useEffect(() => {
  //   stripe_payment_intent(useCart.getState().cartItems).then((res) => {
  //     if (res) setClientSecret(res);
  //   });
  // }, []);

  return (
    <>
      {clientSecret !== '' && (
        <Elements
          options={{ clientSecret, loader: 'always' }}
          stripe={stripePromise}
        >
          <StripeForm />
        </Elements>
      )}
    </>
  );
};

export default StripeCheckout;
