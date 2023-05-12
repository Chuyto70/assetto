import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { isOnSale } from '@/lib/helper';
import { CartItem, Product } from '@/lib/interfaces';

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
    increment: (state, action: PayloadAction<Product>) => {
      const item = state.cartItems.find(
        (el) =>
          el.product.id === action.payload.id &&
          el.product.selectedSize === action.payload.selectedSize
      );

      if (item) item.qty++;
      else if (action.payload.selectedSize) {
        if (
          action.payload.attributes.sizes.find(
            (pSize) =>
              (pSize.quantity > 0 || pSize.quantity === -1) &&
              pSize.size === action.payload.selectedSize
          )
        ) {
          const price = isOnSale(
            action.payload.attributes.date_on_sale_from,
            action.payload.attributes.date_on_sale_to
          )
            ? action.payload.attributes.sale_price ??
              action.payload.attributes.price
            : action.payload.attributes.price;
          state.cartItems.push({
            product: action.payload,
            qty: 1,
            price: price,
            size: action.payload.selectedSize,
          });
        }
      }
    },

    // Remove item from cart
    decrement: (state, action: PayloadAction<Product>) => {
      const item = state.cartItems.find(
        (el) =>
          el.product.id === action.payload.id &&
          el.product.selectedSize === action.payload.selectedSize
      );
      if (item) {
        item.qty--;
        if (item.qty <= 0)
          state.cartItems = state.cartItems.filter(
            (el) =>
              el.product.id !== action.payload.id ||
              el.product.selectedSize !== action.payload.selectedSize
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
      (total += current.price * current.qty),
    0
  )
);

export const { increment, decrement } = cartSlice.actions;
export default cartSlice.reducer;
