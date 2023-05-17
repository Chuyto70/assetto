'use client';

import style from './Cart.module.css';

import Button from '@/components/elements/buttons/Button';
import { CartItemCard } from '@/components/elements/cards/CartItemCard';

import { useCart } from '@/store';

export default function Cart() {
  const cartItems = useCart((state) => state.cartItems);
  const cartTotalPrice = useCart.getState().totalPrice;
  const emptyCart = useCart((state) => state.emptyCart);

  return (
    <div className={style.cart}>
      {cartItems.map((item, index) => (
        <CartItemCard key={index} cartItem={item} />
      ))}
      {!cartItems.length && <p>Empty cart</p>}
      <div className={style.cart__total}>
        <p>Total</p>
        <p>{cartTotalPrice} €</p>
      </div>
      <Button variant='outline' onClick={emptyCart}>
        Vider le panier
      </Button>
    </div>
  );
}
