'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import style from './Cart.module.css';

import Button from '@/components/elements/buttons/Button';
import { CartItemCard } from '@/components/elements/cards/CartItemCard';

import useStore from '@/store';
import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

import { create_strapi_order } from '@/actions/checkoutActions';

const Cart = () => {
  const router = useRouter();

  const cartItems = useStore(useCart, (state) => state.cartItems);
  const cartTotalPrice = useStore(useCart, (state) => state.totalPrice) ?? 0;
  const emptyCart = useCart((state) => state.emptyCart);
  const setClientSecret = useCart((state) => state.setClientSecret);
  const setPaymentIntentId = useCart((state) => state.setPaymentIntentId);
  const refreshCart = useCart((state) => state.refreshCart);
  const clientSecret = useCart((state) => state.clientSecret);
  const paymentIntentId = useCart((state) => state.paymentIntentId);

  const notify = useToaster((state) => state.notify);

  const translations = useServer.getState().translations;

  const [validated, setValidated] = useState(false);

  const validateCart = () => {
    if (validated) return;
    if (cartItems && cartItems.length) {
      if (!clientSecret || !paymentIntentId) {
        setValidated(true);
        const itemsToValidate = cartItems.map((item) => {
          return {
            id: item.product.id,
            title: item.product.attributes.title,
            price: item.price,
            qty: item.qty,
            size: item.size,
            color: item.color,
          };
        });

        create_strapi_order(itemsToValidate)
          .then((response) => {
            if (response.error || !response.data) {
              if (response.error === 'not-equal') {
                refreshCart();
                notify(2, <p>!Panier invalide, il a été mis à jour</p>, 6000);
                setValidated(false);
              } else if (response.error === 'insufficient-quantity-available') {
                notify(1, <p>!Quantité disponible insuffisante</p>, 6000);
                setValidated(false);
              } else {
                notify(2, <p>!Une erreur s'est produite</p>);
                setValidated(false);
              }
            } else {
              const { id, client_secret } = response.data;
              if (id && client_secret) {
                setClientSecret(client_secret);
                setPaymentIntentId(id);
                router.push('/paiement'); //redirect to checkout Page //!Changer le lien pour un dynamic
              } else {
                notify(2, <p>!Une erreur s'est produite</p>);
                setValidated(false);
              }
            }
          })
          .catch(() => {
            notify(2, <p>!Une erreur s'est produite</p>);
            setValidated(false);
          });
      } else {
        //update stripe intent and redirect
      }
    } else {
      notify(3, <p>!Aucun produit dans votre panier</p>);
    }
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
      <Button isLoading={validated} variant='outline' onClick={validateCart}>
        !Valider mon panier
      </Button>
    </div>
  );
};

export default Cart;
