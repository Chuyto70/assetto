'use client';

import clsxm from '@/lib/clsxm';
import { MediaUrl } from '@/lib/helper';
import { CartItem } from '@/lib/interfaces';

import { QtyBtn } from '@/components/elements/buttons/QtyBtn';
import NextImage from '@/components/NextImage';

import { useCart } from '@/store/cartStore';

type CartItemCardType = {
  cartItem: CartItem;
  className?: string;
  displayQtyBtn?: boolean;
};

export const CartItemCard = ({
  cartItem,
  className,
  displayQtyBtn = false,
}: CartItemCardType) => {
  const { increment, decrement } = useCart((state) => ({
    increment: state.increment,
    decrement: state.decrement,
  }));
  const { title, medias } = cartItem.product.attributes ?? {};
  const totalPrice = cartItem.price * cartItem.qty;

  return (
    <div
      className={clsxm(
        'w-full grid grid-cols-4 auto-cols-auto gap-3 md:gap-8',
        className
      )}
    >
      <div className='relative flex aspect-square max-w-[150px]'>
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
        <span className='border-carbon-900 absolute right-0 -top-0 flex aspect-square h-[1em] w-[1em] p-2 text-[.8em] items-center justify-center rounded-full border-2 font-bold backdrop-blur-sm'>
          {cartItem.qty}
        </span>
      </div>
      <div className='col-span-2 flex flex-col justify-center'>
        <p className='text-carbon-900 font-bold'>{title}</p>
        <span className='text-carbon-400 font-normal'>
          {cartItem.size}
          {cartItem.color && ` - ${cartItem.color}`}
        </span>
      </div>
      <div className='flex flex-col items-end justify-center gap-4'>
        <p className='max-w-full truncate'>{totalPrice} €</p>
        {displayQtyBtn && (
          <div>
            <QtyBtn
              onIncrease={() => increment(cartItem.product)}
              onDecrease={() => decrement(cartItem.product)}
              qty={cartItem.qty}
            />
          </div>
        )}
      </div>
    </div>
  );
};
