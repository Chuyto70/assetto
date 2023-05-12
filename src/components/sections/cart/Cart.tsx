'use client';

import { CartItemCard } from '@/components/elements/cards/CartItemCard';

import { useAppSelector } from '@/store';

export const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);

  return (
    <>
      PANIER :
      {cartItems.map((item, index) => (
        <CartItemCard key={index} cartItem={item} />
      ))}
    </>
  );
};
