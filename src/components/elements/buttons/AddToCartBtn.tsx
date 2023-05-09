'use client';

import { graphQLProductProps } from '@/lib/graphql';

import Button from '@/components/elements/buttons/Button';
import { QtyBtn } from '@/components/elements/buttons/QtyBtn';

import { useAppDispatch, useAppSelector } from '@/store';
import { decrement, increment, productQtySelector } from '@/store/slice/cart';

export const AddToCartBtn = ({
  product,
  displayQty = false,
}: {
  product: graphQLProductProps;
  displayQty?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const qty = useAppSelector((state) => productQtySelector(state, product.id));

  const handleClick = () => {
    dispatch(increment(product));
  };

  return (
    <>
      <Button variant='outline' onClick={handleClick}>
        AddToCart
      </Button>
      {displayQty && qty && (
        <QtyBtn
          onIncrease={() => dispatch(increment(product))}
          onDecrease={() => dispatch(decrement(product))}
          qty={qty}
        />
      )}
    </>
  );
};
