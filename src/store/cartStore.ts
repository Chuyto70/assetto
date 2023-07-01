// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { QueryProduct } from '@/lib/graphql';
import { isOnSale, toFixedNumber } from '@/lib/helper';
import { CartItem, Product } from '@/lib/interfaces';

import { AddressFormType } from '@/components/elements/forms/AddressForm';

export interface CartState {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  address: AddressFormType;
  stripeClientSecret?: string;
  stripePaymentIntentId?: string;
}

export interface CartActions {
  increment: (product: Product) => void;
  decrement: (product: Product) => void;
  emptyCart: () => void;
  refreshCart: () => void;
  setAddress: (address: AddressFormType) => void;
  setStripeClientSecret: (stripeClientSecret: string) => void;
  setStripePaymentIntentId: (stripePaymentIntentId: string) => void;
}

const initialState: CartState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
  stripeClientSecret: undefined,
  stripePaymentIntentId: undefined,
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
              // Find the corresponding size in the product attributes
              const size = product.attributes.sizes.find(
                (pSize) => pSize.size === product.selectedSize
              );

              // Check if the size exists and if the quantity is sufficient or unlimited
              if (size && (size.quantity > 0 || size.quantity === -1)) {
                // Check if the requested quantity does not exceed the available quantity
                if (size.quantity >= 1 || size.quantity === -1) {
                  const price = isOnSale(
                    product.attributes.date_on_sale_from,
                    product.attributes.date_on_sale_to
                  )
                    ? product.attributes.sale_price ?? product.attributes.price
                    : product.attributes.price;

                  const colorName = product.attributes.colors?.find(
                    (c) => c.product.data.id === product.id
                  )?.name;

                  return {
                    cartItems: [
                      ...state.cartItems,
                      {
                        product: product,
                        qty: 1,
                        price: price,
                        size: product.selectedSize,
                        color: colorName,
                      },
                    ],
                    totalItems: state.totalItems + 1,
                    totalPrice: Number((state.totalPrice + price).toFixed(2)),
                  };
                }
              }
            }
          } else {
            // Find the corresponding size in the product attributes
            const size = product.attributes.sizes.find(
              (pSize) => pSize.size === item.product.selectedSize
            );

            // Check if the quantity is sufficient or unlimited
            if (size && (size.quantity > item.qty || size.quantity === -1)) {
              const updatedCart = state.cartItems.map((el) =>
                el.product.id === product.id &&
                el.product.selectedSize === product.selectedSize
                  ? { ...el, qty: el.qty + 1 }
                  : el
              );

              return {
                cartItems: updatedCart,
                totalItems: state.totalItems + 1,
                totalPrice: toFixedNumber(
                  state.totalPrice + (item?.price ?? 0),
                  2
                ),
              };
            }

            return {};
          }
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
            totalPrice: toFixedNumber(totalPrice, 2),
          };
        }),
      emptyCart: () => set(initialState),
      refreshCart: async () => {
        let updatedCart = await Promise.all(
          get().cartItems.map(async (item) => {
            const { data } = await QueryProduct(item.product.id);

            const price = isOnSale(
              data.attributes.date_on_sale_from,
              data.attributes.date_on_sale_to
            )
              ? data.attributes.sale_price ?? data.attributes.price
              : data.attributes.price;

            const size = data.attributes.sizes.find(
              (el) => el.size === item.size
            );

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
        updatedCart = updatedCart.filter(Boolean);

        const totalItems = get().cartItems.length;
        const totalPrice = toFixedNumber(
          updatedCart.reduce(
            (total, item) => total + item?.price * item?.qty,
            0
          ),
          2
        );
        set({
          cartItems: updatedCart,
          totalItems: totalItems,
          totalPrice: totalPrice,
        });
      },
      setAddress: (address) => set({ address }),
      setStripeClientSecret: (stripeClientSecret: string) =>
        set({ stripeClientSecret }),
      setStripePaymentIntentId: (stripePaymentIntentId: string) =>
        set({ stripePaymentIntentId }),
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
          color: item.color,
        })),
      }),
      onRehydrateStorage: () => (state) => {
        state.refreshCart();
      },
    }
  )
);
