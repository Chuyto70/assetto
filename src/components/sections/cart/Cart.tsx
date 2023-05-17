'use client';

import style from './Cart.module.css';

import Button from '@/components/elements/buttons/Button';
import { CartItemCard } from '@/components/elements/cards/CartItemCard';

import useStore from '@/store';
import { useCart } from '@/store/cartStore';

export default function Cart() {
  const cartItems = useStore(useCart, (state) => state.cartItems);
  const cartTotalPrice = useStore(useCart, (state) => state.totalPrice) ?? 0;
  const emptyCart = useCart((state) => state.emptyCart);

  return (
    <div className={style.cart}>
      {cartItems?.map((item, index) => (
        <CartItemCard key={index} cartItem={item} />
      ))}
      {!cartItems?.length && <p>Empty cart</p>}
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
