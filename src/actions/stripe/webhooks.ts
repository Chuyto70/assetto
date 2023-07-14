'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MutationUpdateManyProductSize,
  MutationUpdateOrder,
  QueryOrderFromPaymentIntent,
} from '@/lib/graphql';
import { OrderProducts } from '@/lib/interfaces';

export const handlePaymentIntentPaymentFailed = async (
  paymentIntentPaymentFailed: any
) => {
  const { order_id, products } = paymentIntentPaymentFailed.metadata;
  if (order_id && products) {
    const input = {
      status: 'failed',
    };
    // restore stock
    MutationUpdateManyProductSize(
      products.map((product: OrderProducts) => product.sizeId),
      products.map((product: OrderProducts) => {
        return { quantity: product.qty };
      })
    )
      .then(async () => {
        await MutationUpdateOrder(order_id, input);
      })
      .catch(() => {
        /**/
      });
  }
};

export const handlePaymentIntentProcessing = async (
  paymentIntentProcessing: any
) => {
  const { order_id } = paymentIntentProcessing.metadata;
  if (order_id) {
    const input = {
      status: 'processing',
    };
    await MutationUpdateOrder(order_id, input);
  }
};

export const handlePaymentIntentSucceeded = async (
  paymentIntentSucceeded: any
) => {
  const { order_id } = paymentIntentSucceeded.metadata;
  if (order_id) {
    const input = {
      status: 'succeeded',
    };
    await MutationUpdateOrder(order_id, input);
  }
};

export const handlePaymentIntentCanceled = async (
  paymentIntentCanceled: any
) => {
  const { payment_intent_id, order_id, products } =
    paymentIntentCanceled.metadata;
  if (order_id && products) {
    const previousOrderState = await QueryOrderFromPaymentIntent(
      payment_intent_id
    );
    const input = {
      status: 'canceled',
    };
    if (previousOrderState.data[0].attributes.status === 'pending') {
      // restore stock
      MutationUpdateManyProductSize(
        products.map((product: OrderProducts) => product.sizeId),
        products.map((product: OrderProducts) => {
          return { quantity: product.qty };
        })
      )
        .then(async () => {
          await MutationUpdateOrder(order_id, input);
        })
        .catch(() => {
          /**/
        });
    }
  }
};