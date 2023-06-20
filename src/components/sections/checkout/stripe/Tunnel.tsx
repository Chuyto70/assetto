'use client';

import { Elements } from '@stripe/react-stripe-js';
import dynamic from 'next/dynamic';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

import AddressForm, {
  AddressFormType,
} from '@/components/sections/checkout/stripe/AddressForm';
import Payment from '@/components/sections/checkout/stripe/Payment';

import { useCart } from '@/store/cartStore';
import { useToaster } from '@/store/toasterStore';

import { stripe_add_address_strapi_order } from '@/actions/stripeCheckoutActions';

const AnimatePresence = dynamic(() =>
  import('framer-motion').then((mod) => mod.AnimatePresence)
);
const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div)
);

const Tunnel = async () => {
  const router = useRouter();
  const stripeClientSecret = useCart((state) => state.stripeClientSecret);
  const stripePaymentIntentId = useCart((state) => state.stripePaymentIntentId);

  const notify = useToaster((state) => state.notify);

  const [step, setStep] = useState(0);

  const validateAddressForm = (data: AddressFormType) => {
    if (stripeClientSecret && stripePaymentIntentId) {
      stripe_add_address_strapi_order(stripePaymentIntentId, data)
        .then(({ error, success }) => {
          if (!error && success) {
            setStep(1);
          } else if (error === 'could-not-update-payment') {
            notify(2, <p>!Impossible de mettre à jour le payement</p>, 6000);
          } else {
            notify(
              2,
              <p>!Une erreur s'est produite, vérifiez votre adresse</p>
            );
          }
        })
        .catch(() => {
          notify(2, <p>!Une erreur s'est produite</p>);
        });
    } else {
      router.push('/panier'); //!push vers le panier
    }
  };

  const options = {
    clientSecret: stripeClientSecret ?? '',
    theme: 'stripe',
  };

  if (stripePaymentIntentId && stripeClientSecret) {
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
              options={options}
              stripe={(await import('@stripe/stripe-js')).loadStripe(
                process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
              )}
            >
              <Payment />
            </Elements>
          )}
        </MotionDiv>
      </AnimatePresence>
    );
  } else {
    return redirect('/panier');
  }
};

export default Tunnel;
