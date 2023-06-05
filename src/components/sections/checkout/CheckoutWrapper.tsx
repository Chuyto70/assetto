'use client';

import { useState } from 'react';

import Switch from '@/components/elements/buttons/Switch';
import AddressForm from '@/components/elements/forms/AddressForm';

//! Penser a proteger cet accès si il n'y a pas de intentId
const CheckoutWrapper = () => {
  const [shippingDifferent, setShippingDifferent] = useState(false);

  return (
    <>
      <Switch toggle={() => setShippingDifferent(!shippingDifferent)} />
      <AddressForm />
      {shippingDifferent && <AddressForm />}
    </>
  );
};

export default CheckoutWrapper;
