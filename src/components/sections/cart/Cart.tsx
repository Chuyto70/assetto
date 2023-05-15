'use client';

import style from './Cart.module.css';

import Button from '@/components/elements/buttons/Button';
import { CartItemCard } from '@/components/elements/cards/CartItemCard';

import { useAppDispatch, useAppSelector } from '@/store';
import { emptyCart, totalPriceSelector } from '@/store/slice/cart';

export default function Cart() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const cartTotalPrice = useAppSelector(totalPriceSelector);

  return (
    <div className={style.cart}>
      {cartItems.map((item, index) => (
        <CartItemCard key={index} cartItem={item} />
      ))}
      {!cartItems.length && <p>Empty cart</p>}
      <div className={style.cart__total}>
        <p>total</p>
        <p>{cartTotalPrice} €</p>
      </div>
      <Button variant='outline' onClick={() => dispatch(emptyCart())}>
        Vider le panier
      </Button>
    </div>
  );
}
