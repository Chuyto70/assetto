'use client';

import style from './Cart.module.css';

import { CartItemCard } from '@/components/elements/cards/CartItemCard';

import { useAppSelector } from '@/store';
import { totalPriceSelector } from '@/store/slice/cart';

export const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const cartTotalPrice = useAppSelector(totalPriceSelector);

  return (
    <div className={style.cart}>
      {cartItems.map((item, index) => (
        <CartItemCard key={index} cartItem={item} />
      ))}
      <div className={style.cart__total}>
        <p>total</p>
        <p>{cartTotalPrice} €</p>
      </div>
    </div>
  );
};
