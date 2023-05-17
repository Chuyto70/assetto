import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { isOnSale } from '@/lib/helper';
import { CartItem, Product } from '@/lib/interfaces';

export interface CartState {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartActions {
  increment: (product: Product) => void;
  decrement: (product: Product) => void;
  emptyCart: () => void;
}

export const useCart = create<CartState & CartActions>()(
  persist(
    (set) => ({
      cartItems: [],
      totalItems: 0,
      totalPrice: 0,
      increment: (product) =>
        set((state) => {
          const item = state.cartItems.find(
            (el) =>
              el.product.id === product.id &&
              el.product.selectedSize === product.selectedSize
          );

          if (!item) {
            if (product.selectedSize) {
              if (
                product.attributes.sizes.find(
                  (pSize) =>
                    (pSize.quantity > 0 || pSize.quantity === -1) &&
                    pSize.size === product.selectedSize
                )
              ) {
                const price = isOnSale(
                  product.attributes.date_on_sale_from,
                  product.attributes.date_on_sale_to
                )
                  ? product.attributes.sale_price ?? product.attributes.price
                  : product.attributes.price;

                return {
                  cartItems: [
                    ...state.cartItems,
                    {
                      product: product,
                      qty: 1,
                      price: price,
                      size: product.selectedSize,
                    },
                  ],
                  totalItems: state.totalItems + 1,
                  totalPrice: state.totalPrice + price,
                };
              }
            }
          }

          const updatedCart = state.cartItems.map((el) =>
            el.product.id === product.id &&
            el.product.selectedSize === product.selectedSize
              ? { ...el, qty: el.qty + 1 }
              : el
          );

          return {
            cartItems: updatedCart,
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + (item?.price ?? 0),
          };
        }),
      decrement: (product) =>
        set((state) => {
          const item = state.cartItems.find(
            (el) =>
              el.product.id === product.id &&
              el.product.selectedSize === product.selectedSize
          );

          if (!item) {
            return {};
          }

          const updatedCart = state.cartItems
            .map((el) =>
              el.product.id === product.id &&
              el.product.selectedSize === product.selectedSize
                ? { ...el, qty: el.qty - 1 }
                : el
            )
            .filter((el) => el.qty > 0);

          const totalItems =
            state.totalItems - 1 > 0 ? state.totalItems - 1 : 0;
          const totalPrice =
            state.totalPrice - (item?.price ?? 0) > 0
              ? state.totalPrice - (item?.price ?? 0)
              : 0;

          return {
            cartItems: updatedCart,
            totalItems: totalItems,
            totalPrice: totalPrice,
          };
        }),
      emptyCart: () =>
        set(() => ({ cartItems: [], totalItems: 0, totalPrice: 0 })),
    }),
    {
      name: 'cart',
    }
  )
);
