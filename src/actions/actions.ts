'use server';

import Stripe from 'stripe';

import { CartItem } from '@/lib/interfaces';
import logger from '@/lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2022-11-15',
});

export async function stripe_payment_intent(cartItems: CartItem[]) {
  logger(cartItems, 'items');
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return paymentIntent.client_secret;
}

export async function create_strapi_order() {
  return;
}
