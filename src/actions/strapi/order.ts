'use server';

import Stripe from 'stripe';

import { MutationCreateOrder, MutationUpdateOrder } from '@/lib/graphql';
import { OrderProducts } from '@/lib/interfaces';

import { AddressFormType } from '@/components/elements/forms/AddressForm';

const stripe = new Stripe(global.process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2022-11-15',
});

type StrapiError = {
  error?: {
    type: string;
    message?: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
};

const createOrUpdateOrder = async (
  total: number,
  orderProducts: OrderProducts[],
  order_id?: string,
  payment_intent_id?: string
): Promise<StrapiError> => {
  const input = {
    payment_intent_id,
    amount: total,
    products: orderProducts,
  };
  try {
    if (order_id) {
      const { updateOrder } = await MutationUpdateOrder(order_id, input);
      return { data: { order_id: updateOrder.data.id } };
    }
    const { createOrder } = await MutationCreateOrder(input);
    return { data: { order_id: createOrder.data.id } };
  } catch (error) {
    return { error: { type: 'internal-server-error' } };
  }
};

export const updateOrderAddress = async (
  ckAddress: AddressFormType,
  payment_intent_id: string
): Promise<StrapiError> => {
  try {
    const { id, status, metadata } = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );
    if (status !== 'requires_payment_method')
      return { error: { type: 'forbidden-update' } };
    const input = {
      payment_intent_id: id,
      email: ckAddress.email,
      billing_name: ckAddress.address.name,
      billing_city: ckAddress.address.city,
      billing_country: ckAddress.address.country,
      billing_line1: ckAddress.address.line1,
      billing_line2: ckAddress.address.line2,
      billing_postal_code: ckAddress.address.postal_code,
      billing_state: ckAddress.address.state,
      shipping_name: ckAddress.shipping.name,
      shipping_city: ckAddress.shipping.city,
      shipping_country: ckAddress.shipping.country,
      shipping_line1: ckAddress.shipping.line1,
      shipping_line2: ckAddress.shipping.line2,
      shipping_postal_code: ckAddress.shipping.postal_code,
      shipping_state: ckAddress.shipping.state,
    };
    await MutationUpdateOrder(metadata.order_id, input);
    return {};
  } catch (error) {
    return { error: { type: 'internal-server-error' } };
  }
};

export default createOrUpdateOrder;
