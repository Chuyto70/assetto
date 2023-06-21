'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/elements/buttons/Button';
import { CartItemCard } from '@/components/elements/cards/CartItemCard';

import useStore from '@/store';
import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

import createOrUpdatePaymentIntent from '@/actions/stripe/paymentIntents';

const Cart = ({ checkoutPage }: { checkoutPage?: string }) => {
  const router = useRouter();

  const cartItems = useStore(useCart, (state) => state.cartItems);
  const cartTotalPrice = useStore(useCart, (state) => state.totalPrice) ?? 0;
  const payment_intent_id = useCart((state) => state.stripePaymentIntentId);
  const setPaymentIntentId = useCart((state) => state.setStripePaymentIntentId);
  const setClientSecret = useCart((state) => state.setStripeClientSecret);
  const emptyCart = useCart((state) => state.emptyCart);
  const refreshCart = useCart((state) => state.refreshCart);

  const translations = useServer.getState().translations;

  const notify = useToaster.getState().notify;

  const [validated, setValidated] = useState(false);

  const validateCart = () => {
    if (validated || !cartItems?.length) return;
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

    createOrUpdatePaymentIntent(itemsToValidate, payment_intent_id)
      .then(({ error, data }) => {
        if (error) {
          switch (error.type) {
            case 'insufficient-quantity-available':
              if (error.message) {
                const item = JSON.parse(error.message);
                notify(
                  1,
                  <p>
                    {translations.error.insufficient_quantity_available_for}{' '}
                    {item.title} - {item.color}
                  </p>,
                  6000
                );
              } else {
                notify(
                  1,
                  <p>{translations.error.insufficient_quantity_available}</p>,
                  6000
                );
              }
              break;
            case 'not-equal':
              refreshCart();
              notify(
                2,
                <p>{translations.error.cart_not_equal_updated}</p>,
                6000
              );
              break;
            case 'internal-server-error':
              notify(2, <p>{translations.error.internal_server_error}</p>);
              break;
            default:
              refreshCart();
              notify(2, <p>{translations.error.internal_server_error}</p>);
              break;
          }
          setValidated(false);
          return;
        }
        if (data && checkoutPage) {
          setPaymentIntentId(data.payment_intent_id);
          setClientSecret(data.client_secret);
          router.push(checkoutPage);
        }
        setValidated(false);
        return;
      })
      .catch(() => {
        notify(2, <p>{translations.error.internal_server_error}</p>);
        setValidated(false);
      });
  };

  return (
    <div className='flex flex-col gap-4 md:gap-8'>
      {cartItems?.map((item, index) => (
        <CartItemCard key={index} cartItem={item} />
      ))}
      {!cartItems?.length && <p>{translations.cart?.empty}</p>}
      <div className='border-dark flex justify-between border-t-2 pt-4 font-bold md:pt-8'>
        <p>{translations.total}</p>
        <p>{cartTotalPrice} €</p>
      </div>
      <Button variant='outline' onClick={emptyCart}>
        {translations.cart?.empty_btn}
      </Button>
      <Button
        disabled={!cartItems?.length}
        isLoading={validated}
        variant='outline'
        onClick={validateCart}
      >
        {translations.cart?.validate_btn}
      </Button>
    </div>
  );
};

export default Cart;
