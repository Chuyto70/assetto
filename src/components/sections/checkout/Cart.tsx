'use client';

import style from './Cart.module.css';

import Button from '@/components/elements/buttons/Button';
import { CartItemCard } from '@/components/elements/cards/CartItemCard';

import useStore from '@/store';
import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

import { create_strapi_order } from '@/actions/checkoutActions';

const Cart = () => {
  const cartItems = useStore(useCart, (state) => state.cartItems);
  const cartTotalPrice = useStore(useCart, (state) => state.totalPrice) ?? 0;
  const emptyCart = useCart((state) => state.emptyCart);
  const setClientSecret = useCart((state) => state.setClientSecret);
  const setOrderId = useCart((state) => state.setOrderId);
  const refreshCart = useCart((state) => state.refreshCart);
  const clientSecret = useCart((state) => state.clientSecret);

  const notify = useToaster((state) => state.notify);

  const translations = useServer.getState().translations;

  const validateCart = () => {
    if (cartItems && cartItems.length) {
      if (!clientSecret) {
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
              } else if (response.error === 'insufficient-quantity-available') {
                notify(1, <p>!Quantité disponible insuffisante</p>, 6000);
              } else {
                notify(2, <p>!Une erreur s'est produite</p>);
              }
            } else {
              const { client_secret, order_id } = response.data;
              if (client_secret && order_id) {
                setClientSecret(client_secret);
                setOrderId(order_id); //Could later improve this by saving orderID in persistedState and clientSecret in backend to restore checkout session
                //redirect to checkout Page
              } else {
                notify(2, <p>!Une erreur s'est produite</p>);
              }
            }
          })
          .catch(() => notify(2, <p>!Une erreur s'est produite</p>));
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
      <Button variant='outline' onClick={validateCart}>
        !Valider mon panier
      </Button>
      {/* FAIRE CHARGER LE BOUTON UNE FOIS APPUYER POUR EVITER LES CLICS MULTIPLE */}
    </div>
  );
};

export default Cart;
