'use client';

import { MediaUrl } from '@/lib/helper';
import { CartItem } from '@/lib/interfaces';

import { QtyBtn } from '@/components/elements/buttons/QtyBtn';
import NextImage from '@/components/NextImage';

import { useAppDispatch } from '@/store';
import { decrement, increment } from '@/store/slice/cart';

export const CartItemCard = ({ cartItem }: { cartItem: CartItem }) => {
  const dispatch = useAppDispatch();
  const { title, medias, colors } = cartItem.product.attributes;

  return (
    <div>
      <NextImage
        src={MediaUrl(medias.data[0].attributes.url)}
        width={150}
        height={150}
        alt={medias.data[0].attributes.alternativeText ?? ''}
      />
      <p>{title}</p>
      <p>Taille : {cartItem.size}</p>
      <p>
        Colori :{' '}
        {colors &&
          colors.find((color) => color.product.data.id === cartItem.product.id)
            ?.name}
      </p>
      <p>Quantité : {cartItem.qty}</p>
      <QtyBtn
        onIncrease={() => dispatch(increment(cartItem.product))}
        onDecrease={() => dispatch(decrement(cartItem.product))}
        qty={cartItem.qty}
      />
    </div>
  );
};
