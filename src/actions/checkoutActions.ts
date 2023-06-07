'use server';

import Stripe from 'stripe';

import {
  MutationCreateOrder,
  MutationDeleteOrder,
  MutationUpdateOrder,
  QueryProduct,
} from '@/lib/graphql';
import { deepEqual, isOnSale } from '@/lib/helper';
import { OrderProducts } from '@/lib/interfaces';

import { CheckoutAddressType } from '@/components/sections/checkout/CheckoutAddress';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2022-11-15',
});

const checkProducts = async (orderProducts: OrderProducts[]) => {
  try {
    // Use Promise.all to check each item in parallel
    const checkedItems = await Promise.all(
      orderProducts.map(async (item) => {
        // Query the product data by id
        const { data } = await QueryProduct(item.id);

        // Determine the price based on the sale dates
        const price = isOnSale(
          data.attributes.date_on_sale_from,
          data.attributes.date_on_sale_to
        )
          ? data.attributes.sale_price ?? data.attributes.price
          : data.attributes.price;

        // Find the size that matches the item size
        const size = data.attributes.sizes.find((el) => el.size === item.size);

        // Check if the size exists and has enough quantity
        if (size && (size.quantity > 0 || size.quantity === -1)) {
          if (size.quantity >= item.qty || size.quantity === -1) {
            // Return the item with the price
            return {
              ...item,
              price: price,
            };
          }
        }
        return Promise.reject('insufficient-quantity-available');
      })
    );

    // Check if the checked items are equal to the order products
    if (deepEqual(orderProducts, checkedItems)) {
      // Return the checked items as data
      return { data: checkedItems };
    }
    // Return an error object with not-equal message
    return { error: 'not-equal' };
  } catch (error) {
    // Return an error object with the caught error
    return { error: error };
  }
};

async function stripe_payment_intent(amount: number, orderId: number) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, //stripe wants amount in cent
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      order_id: orderId,
    },
  });
  return paymentIntent;
}

export async function create_strapi_order(orderProducts: OrderProducts[]) {
  try {
    const { data, error: checkError } = await checkProducts(orderProducts);

    if (!checkError) {
      const total = data?.reduce((acc, item) => {
        return item ? acc + item.price * item.qty : acc;
      }, 0);

      const products = data?.map((item) => {
        return {
          id: item?.id,
          title: item?.title,
          price: item?.price,
          qty: item?.qty,
          size: item?.size,
          color: item?.color,
        };
      });

      const input = {
        amount: total,
        products,
      };

      if (total && products) {
        const { createOrder } = await MutationCreateOrder(input);
        const { id, client_secret } = await stripe_payment_intent(
          total,
          createOrder.data.id
        );
        return { data: { id, client_secret } };
      }
      return { error: 'internal-server-error' };
    }
    return { error: checkError };
  } catch (error) {
    return { error: 'internal-server-error' };
  }
}

export async function add_address_strapi_order(
  paymentIntentId: string,
  ckAddress: CheckoutAddressType
) {
  try {
    const { address, shipping, email } = ckAddress;
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { name: addressName, ...addressWithoutName } = address;

    const stripeAddress = {
      shipping: {
        address: {
          ...addressWithoutName,
          line2: address.line2 ?? undefined,
          state: address.state ?? undefined,
          ...(ckAddress.shippingDifferent && {
            city: shipping.city ?? address.city,
            country: shipping.country ?? address.country,
            line1: shipping.line1 ?? address.line1,
            line2: shipping.line2 ?? address.line2 ?? undefined,
            postal_code: shipping.postal_code ?? address.postal_code,
            state: shipping.state ?? address.state ?? undefined,
          }),
        },
        name: ckAddress.shippingDifferent
          ? shipping.name ?? address.name
          : address.name,
      },
      receipt_email: email,
    };

    const { id, metadata } = await stripe.paymentIntents.update(
      paymentIntentId,
      stripeAddress
    );

    if (metadata) {
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
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { updateOrder } = await MutationUpdateOrder(
        metadata.order_id,
        input
      );
    } else {
      return; //Erreur
    }
  } catch (err) {
    return;
  }
}

export async function abandon_payment_intent(paymentIntentId: string) {
  try {
    const { metadata } = await stripe.paymentIntents.cancel(paymentIntentId, {
      cancellation_reason: 'abandoned',
    });
    if (metadata) MutationDeleteOrder(metadata.order_id);
  } catch (err) {
    return;
  }
}
