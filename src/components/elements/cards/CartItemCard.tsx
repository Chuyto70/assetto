'use client';

import style from './CartItemCard.module.css';

import { MediaUrl } from '@/lib/helper';
import { CartItem } from '@/lib/interfaces';

import { QtyBtn } from '@/components/elements/buttons/QtyBtn';
import NextImage from '@/components/NextImage';

import { useCart } from '@/store';

export const CartItemCard = ({ cartItem }: { cartItem: CartItem }) => {
  const { increment, decrement } = useCart((state) => ({
    increment: state.increment,
    decrement: state.decrement,
  }));
  const { title, medias, colors } = cartItem.product.attributes;
  const totalPrice = cartItem.price * cartItem.qty;

  return (
    <div className={style.card}>
      <div className={style.card__img_container}>
        <NextImage
          src={MediaUrl(medias.data[0].attributes.url)}
          useSkeleton
          width={medias.data[0].attributes.width}
          height={medias.data[0].attributes.height}
          alt={medias.data[0].attributes.alternativeText ?? ''}
          className={style.card__img}
          imgClassName='object-cover object-center w-full h-full'
          sizes='50vw'
        />
        <span className={style.card__img_qty}>{cartItem.qty}</span>
      </div>
      <div className={style.card__content}>
        <p>{title}</p>
        <span>
          {cartItem.size && `${cartItem.size} - `}
          {colors &&
            colors.find(
              (color) => color.product.data.id === cartItem.product.id
            )?.name}
        </span>
      </div>
      <div className={style.card__price}>
        <p>{totalPrice} €</p>
        <div>
          <QtyBtn
            onIncrease={() => increment(cartItem.product)}
            onDecrease={() => decrement(cartItem.product)}
            qty={cartItem.qty}
          />
        </div>
      </div>
    </div>
  );
};
