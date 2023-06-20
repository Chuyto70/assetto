/* eslint-disable @typescript-eslint/no-explicit-any */
import logger from '@/lib/logger';

export const handlePaymentIntentPaymentFailed = (
  paymentIntentPaymentFailed: any
) => {
  logger(paymentIntentPaymentFailed);
};

export const handlePaymentIntentProcessing = (paymentIntentProcessing: any) => {
  logger(paymentIntentProcessing);
};

export const handlePaymentIntentSucceeded = (paymentIntentSucceeded: any) => {
  logger(paymentIntentSucceeded);
};
