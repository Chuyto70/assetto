import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { graphQLProductProps } from '@/lib/graphql';
import { CartItem } from '@/lib/interfaces';

import { RootState } from '@/store';

export interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    increment: (state, action: PayloadAction<graphQLProductProps>) => {
      const item = state.cartItems.find(
        (el) => el.product.id === action.payload.id
      );
      if (item) item.qty++;
      else {
        state.cartItems.push({
          product: action.payload,
          qty: 1,
        });
      }
    },

    // Remove item from cart
    decrement: (state, action: PayloadAction<graphQLProductProps>) => {
      const item = state.cartItems.find(
        (el) => el.product.id === action.payload.id
      );
      if (item) {
        item.qty--;
        if (item.qty <= 0)
          state.cartItems = state.cartItems.filter(
            (el) => el.product.id !== action.payload.id
          );
      }
    },
  },
});

const cartItems = (state: RootState) => state.cart.cartItems;

export const totalCartItemSelector = createSelector([cartItems], (cartItems) =>
  cartItems.reduce(
    (total: number, current: CartItem) => (total += current.qty),
    0
  )
);

export const totalPriceSelector = createSelector([cartItems], (cartItems) =>
  cartItems.reduce(
    (total: number, current: CartItem) =>
      (total += current.qty * current.product.attributes.price),
    0
  )
);

export const productQtySelector = createSelector(
  [cartItems, (cartItems, productId: number) => productId],
  (cartItems, productId) =>
    cartItems.find((el) => el.product.id === productId)?.qty
);

export const { increment, decrement } = cartSlice.actions;
export default cartSlice.reducer;
