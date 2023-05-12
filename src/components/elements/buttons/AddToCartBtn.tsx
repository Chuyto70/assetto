'use client';

import { Product } from '@/lib/interfaces';

import Button from '@/components/elements/buttons/Button';

import { useAppDispatch } from '@/store';
import { increment } from '@/store/slice/cart';

export const AddToCartBtn = ({ product }: { product: Product }) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(increment(product));
  };

  return (
    <Button variant='outline' onClick={handleClick}>
      AddToCart
    </Button>
  );
};
