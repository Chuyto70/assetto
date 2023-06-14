'use client';

import dynamic from 'next/dynamic';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

import AddressForm, {
  AddressFormType,
} from '@/components/sections/checkout/stripe/AddressForm';

import { useCart } from '@/store/cartStore';
import { useToaster } from '@/store/toasterStore';

import { stripe_add_address_strapi_order } from '@/actions/stripeCheckoutActions';

const AnimatePresence = dynamic(() =>
  import('framer-motion').then((mod) => mod.AnimatePresence)
);
const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div)
);

const Tunnel = () => {
  const router = useRouter();
  const stripeClientSecret = useCart((state) => state.stripeClientSecret);
  const stripePaymentIntentId = useCart((state) => state.stripePaymentIntentId);

  const notify = useToaster((state) => state.notify);

  const [step, setStep] = useState(0);

  // useEffect(() => {
  //   if (stripePaymentIntentId && stripeClientSecret) {
  //     stripe_retrieve_payment_intent(stripePaymentIntentId, stripeClientSecret).then((res) => {
  //       console.log(res);
  //       if (res.status !== 'requires_payment_method' || res.error) {
  //         // router.push('/panier');
  //       }
  //     });
  //   }
  // }, [router, stripeClientSecret, stripePaymentIntentId]);

  const validateAddressForm = (data: AddressFormType) => {
    if (stripeClientSecret && stripePaymentIntentId) {
      stripe_add_address_strapi_order(stripePaymentIntentId, data)
        .then(({ error, success }) => {
          if (!error && success) {
            setStep(1);
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

  if (stripePaymentIntentId) {
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
          {step === 1 && <p>step 2</p>}
        </MotionDiv>
      </AnimatePresence>
    );
  } else {
    return redirect('/panier');
  }
};

export default Tunnel;
