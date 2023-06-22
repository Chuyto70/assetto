'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  MutationUpdateOrder,
  MutationUpdateProduct,
  QueryProduct,
} from '@/lib/graphql';
import { OrderProducts } from '@/lib/interfaces';

export const handlePaymentIntentPaymentFailed = async (
  paymentIntentPaymentFailed: any
) => {
  const { order_id } = paymentIntentPaymentFailed.metadata;
  if (order_id) {
    const input = {
      status: 'failed',
    };
    await MutationUpdateOrder(order_id, input);
    // remettre le stock du paiement echoué
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

    const products: OrderProducts[] = await JSON.parse(
      paymentIntentProcessing.metadata.products
    );

    // Update stocks
    // I should edit strapi server to create a mutation only for the product size rather than replacing the hole array
    products.forEach((product) => {
      QueryProduct(product.id).then(({ data }) => {
        const size = data.attributes.sizes.find(
          (el) => el.size === product.size
        );
        if (size && size.quantity !== -1) {
          const input = {
            sizes: [
              ...data.attributes.sizes,
              {
                ...size,
                quantity:
                  size.quantity - product.qty >= 0
                    ? size.quantity - product.qty
                    : 0,
              },
            ],
          };
          MutationUpdateProduct(product.id, input);
        }
      });
    });
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
  const { order_id } = paymentIntentCanceled.metadata;
  if (order_id) {
    const input = {
      status: 'canceled',
    };
    await MutationUpdateOrder(order_id, input);
  }
};
