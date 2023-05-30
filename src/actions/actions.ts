'use server';

import Stripe from 'stripe';

import { MutationCreateOrder, QueryProduct } from '@/lib/graphql';
import { isOnSale } from '@/lib/helper';
import { OrderProducts } from '@/lib/interfaces';

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
    if (checkedItems === orderProducts) {
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

export async function stripe_payment_intent(amount: number) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, //stripe wants amount in cent
    currency: 'eur',
    automatic_payment_methods: {
      enabled: true,
    },
  });
  return paymentIntent.client_secret;
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
      const { createOrder } = await MutationCreateOrder(input);
      return { data: { total, orderID: createOrder.data.id } };
    }

    return { error: checkError };
  } catch (error) {
    return { error: 'internal-server-error' };
  }
}
