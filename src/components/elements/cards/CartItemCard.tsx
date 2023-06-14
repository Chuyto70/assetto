'use client';

import { MediaUrl } from '@/lib/helper';
import { CartItem } from '@/lib/interfaces';

import { QtyBtn } from '@/components/elements/buttons/QtyBtn';
import NextImage from '@/components/NextImage';

import { useCart } from '@/store/cartStore';

export const CartItemCard = ({ cartItem }: { cartItem: CartItem }) => {
  const { increment, decrement } = useCart((state) => ({
    increment: state.increment,
    decrement: state.decrement,
  }));
  const { title, medias } = cartItem.product.attributes ?? {};
  const totalPrice = cartItem.price * cartItem.qty;

  return (
    <div className='grid grid-cols-3 gap-4 md:gap-8'>
      <div className='relative flex aspect-square'>
        {medias && (
          <NextImage
            src={MediaUrl(medias.data[0].attributes.url)}
            useSkeleton
            priority
            width={medias.data[0].attributes.width}
            height={medias.data[0].attributes.height}
            alt={medias.data[0].attributes.alternativeText ?? ''}
            className='overflow-hidden rounded-full'
            imgClassName='object-cover object-center w-full h-full'
            sizes='50vw'
          />
        )}
        <span className='border-dark absolute right-0 top-0 flex aspect-square w-8 min-w-fit items-center justify-center rounded-full border-2 font-bold backdrop-blur-sm'>
          {cartItem.qty}
        </span>
      </div>
      <div className='flex flex-col justify-center'>
        <p className='text-dark font-bold'>{title}</p>
        <span className='text-gray-400'>
          {cartItem.size}
          {cartItem.color && ` - ${cartItem.color}`}
        </span>
      </div>
      <div className='flex flex-col items-end justify-center gap-4'>
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
