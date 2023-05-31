'use client';

import style from './Cart.module.css';

import Button from '@/components/elements/buttons/Button';
import { CartItemCard } from '@/components/elements/cards/CartItemCard';

import useStore from '@/store';
import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';

import { create_strapi_order } from '@/actions/checkoutActions';

const Cart = () => {
  const cartItems = useStore(useCart, (state) => state.cartItems);
  const cartTotalPrice = useStore(useCart, (state) => state.totalPrice) ?? 0;
  const emptyCart = useCart((state) => state.emptyCart);
  const setClientSecret = useCart((state) => state.setClientSecret);
  const setOrderId = useCart((state) => state.setOrderId);
  const refreshCart = useCart((state) => state.refreshCart);
  const clientSecret = useCart((state) => state.clientSecret);

  const translations = useServer.getState().translations;

  const validateCart = () => {
    if (!clientSecret && cartItems) {
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

      create_strapi_order(itemsToValidate).then((response) => {
        if (response.error || !response.data) {
          if (response.error === 'not-equal') {
            refreshCart();
            //trigger toast for refresh cart
          } else if (response.error === 'insufficient-quantity-available') {
            //trigger toast for quantity
          } else {
            //trigger toast for server error
          }
        } else {
          const { client_secret, order_id } = response.data;
          if (client_secret && order_id) {
            setClientSecret(client_secret);
            setOrderId(order_id); //Could later improve this by saving orderID in persistedState and clientSecret in backend to restore checkout session
            //redirect to checkout Page
          } else {
            //trigger toast for server error
          }
        }
      });
      // .catch(err => console.log(err)); //trigger toast internal error
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
    </div>
  );
};

export default Cart;
