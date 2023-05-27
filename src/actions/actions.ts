'use server';

import Stripe from 'stripe';

import { MutationCreateOrder, QueryProduct } from '@/lib/graphql';
import { deepEqual, isOnSale } from '@/lib/helper';
import { CartItem } from '@/lib/interfaces';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2022-11-15',
});

const checkCart = async (cartItems: CartItem[]) => {
  const checkedItems = await Promise.all(
    cartItems.map(async (item) => {
      const { data } = await QueryProduct(item.product.id);

      const price = isOnSale(
        data.attributes.date_on_sale_from,
        data.attributes.date_on_sale_to
      )
        ? data.attributes.sale_price ?? data.attributes.price
        : data.attributes.price;

      const size = data.attributes.sizes.find((el) => el.size === item.size);

      if (size && (size.quantity > 0 || size.quantity === -1)) {
        if (size.quantity >= item.qty || size.quantity === -1) {
          return {
            ...item,
            product: { ...data, selectedSize: item.size },
            price: price,
          };
        }
      }
    })
  );

  const equals = deepEqual(cartItems, checkedItems);
  if (equals) {
    return { data: checkedItems };
  }
  return { error: 'not-equal' };
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

export async function create_strapi_order(cartItems: CartItem[]) {
  // Check cartProducts with backend
  const { data, error: checkError } = await checkCart(cartItems);
  if (!checkError) {
    const total = data?.reduce((acc, item) => {
      return item ? acc + item.price * item.qty : acc;
    }, 0);

    const products = data?.map((item) => {
      return {
        id: item?.product.id,
        title: item?.product.attributes.title,
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
  return { error: checkError }; //handle errors of checking etc
}
