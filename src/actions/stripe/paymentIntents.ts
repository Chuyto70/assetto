'use server';

import Stripe from 'stripe';

import { OrderProducts } from '@/lib/interfaces';

import checkCart from '@/actions/checkCart';
import createOrUpdateOrder from '@/actions/strapi/order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2022-11-15',
});

type createPaymentIntent = {
  error?: {
    type: string;
    message?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
};

const createOrUpdatePaymentIntent = async (
  orderProducts: OrderProducts[],
  payment_intent_id?: string
): Promise<createPaymentIntent> => {
  const { data, error } = await checkCart(orderProducts);
  if (error) return { error };
  const checkedItems = data as OrderProducts[];
  const total = checkedItems?.reduce((acc, item) => {
    return item ? acc + item.price * item.qty : acc;
  }, 0);
  try {
    if (payment_intent_id) {
      const { id, client_secret, metadata } =
        await stripe.paymentIntents.update(payment_intent_id, {
          amount: total * 100,
          currency: 'eur',
          metadata: {
            products: JSON.stringify(checkedItems),
          },
        });
      const { error } = await createOrUpdateOrder(
        total,
        checkedItems,
        metadata.order_id,
        payment_intent_id
      );
      if (error) return { error };
      return { data: { payment_intent_id: id, client_secret } };
    }
    const { error, data } = await createOrUpdateOrder(total, checkedItems);
    if (error) return { error };
    const { id, client_secret } = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        order_id: data.order_id,
        products: JSON.stringify(checkedItems),
      },
    });
    return { data: { payment_intent_id: id, client_secret } };
  } catch (error) {
    return { error: { type: 'internal-server-error' } };
  }
};

export const abandonPaymentIntent = async (payment_intent_id: string) => {
  try {
    await stripe.paymentIntents.cancel(payment_intent_id, {
      cancellation_reason: 'abandoned',
    });
  } catch (err) {
    return;
  }
};

export default createOrUpdatePaymentIntent;
