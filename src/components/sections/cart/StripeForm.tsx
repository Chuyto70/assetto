'use client';

import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { FormEvent, useState } from 'react';

import Button from '@/components/elements/buttons/Button';

import { create_strapi_order } from '@/actions/actions';

const StripeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    create_strapi_order();
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/complete',
      },
    });

    if (error) setErrorMessage(error.message ?? '');
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>{errorMessage}</p>
      <PaymentElement />
      <Button onClick={handleSubmit}>Submit</Button>
    </form>
  );
};

export default StripeForm;

//ETAPES : RECAP -> VALIDER PANIER -> ADRESSE -> SERVER ACTION STRIPE INTENT + VERIF PANIER :
//                                                                                    -> VERIF SUCCESS -> AJOUT DANS STRAPI ORDER + FORMULAIRE CARTE -> VALIDATION STRIPE :
//                                                                                        SUCCESS : -> PAGE SUCESS + CHANGE STATUS STRAPI ORDERS
//                                                                                        FAIL : -> MESSAGE PAYMENT FAILED + CHANGE STATUS STRAPI ORDERS
//                                                                                    -> VERIF FAIL : TRIGGER UPDATE PANIER + MESSAGE PANIER NON VALIDE -> retour step-1
