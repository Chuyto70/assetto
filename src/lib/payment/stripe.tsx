import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { Dispatch, SetStateAction } from 'react';

import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

import {
  stripe_create_strapi_order,
  stripe_update_strapi_order,
} from '@/actions/stripeCheckoutActions';

export const stripeValidateCart = (
  setValidated: Dispatch<SetStateAction<boolean>>,
  router: AppRouterInstance,
  checkoutPage: string
) => {
  const locale = useServer.getState().locale;

  const cartItems = useCart.getState().cartItems;
  const stripeClientSecret = useCart.getState().stripeClientSecret;
  const stripePaymentIntentId = useCart.getState().stripePaymentIntentId;
  const setStripeClientSecret = useCart.getState().setStripeClientSecret;
  const setStripePaymentIntentId = useCart.getState().setStripePaymentIntentId;
  const refreshCart = useCart.getState().refreshCart;

  const notify = useToaster.getState().notify;

  if (cartItems && cartItems.length) {
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

    if (!stripeClientSecret || !stripePaymentIntentId) {
      stripe_create_strapi_order(itemsToValidate)
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
              setStripeClientSecret(client_secret);
              setStripePaymentIntentId(id);
              router.push(`${locale}/${checkoutPage}`);
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
      stripe_update_strapi_order(itemsToValidate, stripePaymentIntentId)
        .then((response) => {
          if (response.error || !response.success) {
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
            router.push(`${locale}/${checkoutPage}`);
          }
        })
        .catch(() => {
          notify(2, <p>!Une erreur s'est produite</p>);
          setValidated(false);
        });
    }
  } else {
    notify(3, <p>!Aucun produit dans votre panier</p>);
  }
};
