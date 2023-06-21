'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { MutationUpdateOrder } from '@/lib/graphql';

export const handlePaymentIntentPaymentFailed = async (
  paymentIntentPaymentFailed: any
) => {
  const { order_id } = paymentIntentPaymentFailed.metadata;
  if (order_id) {
    const input = {
      status: 'failed',
    };
    await MutationUpdateOrder(order_id, input);
  }
};

export const handlePaymentIntentProcessing = async (
  paymentIntentProcessing: any
) => {
  const { order_id } = paymentIntentProcessing.metadata;
  if (order_id) {
    const input = {
      status: 'pending',
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
