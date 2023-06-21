/* eslint-disable no-case-declarations */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import {
  handlePaymentIntentPaymentFailed,
  handlePaymentIntentProcessing,
  handlePaymentIntentSucceeded,
} from '@/actions/stripe/webhooks';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2022-11-15',
});

const endpointSecret = process.env.STRAPI_WEBHOOK_SECRET ?? '';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  let event: Stripe.Event;

  try {
    if (!sig) throw { message: 'no-signature' };
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      endpointSecret
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          message: `Webhook Error: ${err.message}`,
        },
      },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.payment_failed':
      const paymentIntentPaymentFailed = event.data.object;
      handlePaymentIntentPaymentFailed(paymentIntentPaymentFailed);
      break;
    case 'payment_intent.processing':
      const paymentIntentProcessing = event.data.object;
      handlePaymentIntentProcessing(paymentIntentProcessing);
      break;
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      handlePaymentIntentSucceeded(paymentIntentSucceeded);
      break;
    default:
      break;
  }

  return NextResponse.json({}, { status: 200 });
}

export const runtime = 'edge';
