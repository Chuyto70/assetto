'use client';

import { Elements } from '@stripe/react-stripe-js';
import dynamic from 'next/dynamic';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

import AddressForm, {
  AddressFormType,
} from '@/components/elements/forms/AddressForm';
import StripePayment from '@/components/sections/checkout/stripe/StripePayment';

import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

import { updateOrderAddress } from '@/actions/strapi/order';

const AnimatePresence = dynamic(() =>
  import('framer-motion').then((mod) => mod.AnimatePresence)
);
const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div)
);

const StripeTunnel = async ({
  cartPage,
  completePage,
}: {
  cartPage?: string;
  completePage?: string;
}) => {
  const router = useRouter();

  const stripeClientSecret = useCart((state) => state.stripeClientSecret);
  const stripePaymentIntentId = useCart((state) => state.stripePaymentIntentId);

  const translations = useServer.getState().translations;

  const notify = useToaster((state) => state.notify);

  const [step, setStep] = useState(0);

  const elementsOptions = {
    clientSecret: stripeClientSecret ?? '',
    paymentMethodCreation: 'manual',
    theme: 'stripe',
  };

  const validateAddressForm = (data: AddressFormType) => {
    if (stripePaymentIntentId && stripeClientSecret) {
      updateOrderAddress(data, stripePaymentIntentId)
        .then(({ error }) => {
          if (error) {
            switch (error.type) {
              case 'forbidden-update':
                notify(2, <p>{translations.error.order_forbidden_update}</p>);
                break;
              default:
                notify(2, <p>{translations.error.internal_server_error}</p>);
                break;
            }
            return;
          }
          setStep(1);
        })
        .catch(() => {
          notify(2, <p>{translations.error.internal_server_error}</p>);
        });
      return;
    }
    notify(1, <p>{translations.payment.no_payment_intent}</p>);
    if (cartPage) router.push(cartPage);
  };

  if (!stripePaymentIntentId || !stripeClientSecret) {
    return redirect(cartPage ?? '/');
  }
  return (
    <AnimatePresence mode='wait' initial={false}>
      <MotionDiv
        key={step}
        initial={{ x: 1000, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -1000, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {step === 0 && <AddressForm onSubmit={validateAddressForm} />}
        {step === 1 && (
          <Elements
            options={elementsOptions}
            stripe={(await import('@stripe/stripe-js')).loadStripe(
              process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
            )}
          >
            <StripePayment return_url={completePage ?? '/'} />
          </Elements>
        )}
      </MotionDiv>
    </AnimatePresence>
  );
};

export default StripeTunnel;
