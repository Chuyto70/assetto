'use client';

import { useCart } from '@/store/cartStore';

const CheckoutWrapper = () => {
  const clientSecret = useCart().clientSecret;

  return <div>client secret : {clientSecret}</div>;
};

export default CheckoutWrapper;
