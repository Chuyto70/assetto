// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { QueryProduct } from '@/lib/graphql';
import { isOnSale } from '@/lib/helper';
import { CartItem, Product } from '@/lib/interfaces';

import { useServer } from '@/store/serverStore';

export interface CartState {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartActions {
  increment: (product: Product) => void;
  decrement: (product: Product) => void;
  emptyCart: () => void;
  refreshCart: () => void;
}

const initialState: CartState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCart = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      ...initialState,
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
      emptyCart: () => set(initialState),
      refreshCart: async () => {
        const updatedCart = await Promise.all(
          get().cartItems.map(async (item) => {
            const { data } = await QueryProduct(
              useServer.getState().locale,
              item.product.id
            );

            const price = isOnSale(
              data.attributes.date_on_sale_from,
              data.attributes.date_on_sale_to
            )
              ? data.attributes.sale_price ?? data.attributes.price
              : data.attributes.price;

            if (
              data.attributes.sizes.find(
                (el) =>
                  (el.quantity > 0 || el.quantity === -1) &&
                  el.size === item.size
              )
            ) {
              return {
                ...item,
                product: { ...data, selectedSize: item.size },
                price: price,
              };
            }
          })
        );
        const totalItems = get().cartItems.length;
        const totalPrice = updatedCart.reduce(
          (total, item) => total + item?.price * item?.qty,
          0
        );
        set({
          cartItems: updatedCart,
          totalItems: totalItems,
          totalPrice: totalPrice,
        });
      },
    }),
    {
      name: 'cart',
      version: 1,
      partialize: (state) => ({
        cartItems: state.cartItems.map((item) => ({
          product: { id: item.product.id },
          size: item.size,
          qty: item.qty,
          price: item.price,
        })),
      }),
      onRehydrateStorage: () => (state) => {
        state.refreshCart();
      },
    }
  )
);
