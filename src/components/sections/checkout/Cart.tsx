'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import style from './Cart.module.css';

import { stripeValidateCart } from '@/lib/payment/stripe';

import Button from '@/components/elements/buttons/Button';
import { CartItemCard } from '@/components/elements/cards/CartItemCard';

import useStore from '@/store';
import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';

const Cart = () => {
  const router = useRouter();

  const cartItems = useStore(useCart, (state) => state.cartItems);
  const cartTotalPrice = useStore(useCart, (state) => state.totalPrice) ?? 0;
  const emptyCart = useCart((state) => state.emptyCart);

  const translations = useServer.getState().translations;
  const paymentProvider = useServer.getState().paymentProvider;

  const [validated, setValidated] = useState(false);

  const validateCart = () => {
    if (validated) return;
    if (paymentProvider === 'STRIPE') stripeValidateCart(setValidated, router);
  };

  return (
    <div className={style.cart}>
      {cartItems?.map((item, index) => (
        <CartItemCard key={index} cartItem={item} />
      ))}
      {!cartItems?.length && <p>{translations.cart_empty}</p>}
      <div className={style.cart__total}>
        <p>{translations.total}</p>
        <p>{cartTotalPrice} €</p>
      </div>
      <Button variant='outline' onClick={emptyCart}>
        {translations.empty_cart_btn}
      </Button>
      <Button
        disabled={!cartItems?.length}
        isLoading={validated}
        variant='outline'
        onClick={validateCart}
      >
        !Valider mon panier
      </Button>
    </div>
  );
};

export default Cart;
