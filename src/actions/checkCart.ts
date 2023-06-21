'use server';

import { QueryProduct } from '@/lib/graphql';
import { deepEqual, isOnSale } from '@/lib/helper';
import { OrderProducts } from '@/lib/interfaces';

type checkCart = {
  error?: {
    type: string;
    message?: string;
  };
  data?: unknown;
};

const checkCart = async (
  orderProducts: OrderProducts[]
): Promise<checkCart> => {
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
        return Promise.reject({
          type: 'insufficient-quantity-available',
          message: JSON.stringify(item),
        });
      })
    );

    // Check if the checked items are equal to the order products
    if (deepEqual(orderProducts, checkedItems)) {
      // Return the checked items as data
      return { data: checkedItems };
    }
    // Return an error object with not-equal message
    return {
      error: {
        type: 'not-equal',
      },
    };
  } catch (error) {
    // Return an error object with the caught error
    return {
      error: error as checkCart['error'],
    };
  }
};

export default checkCart;
