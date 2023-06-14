import Tunnel from '@/components/sections/checkout/stripe/Tunnel';

import { useServer } from '@/store/serverStore';

const CheckoutWrapper = () => {
  const paymentProvider = useServer.getState().paymentProvider;
  if (paymentProvider === 'STRIPE') return <Tunnel />;
  return null;
};

export default CheckoutWrapper;
