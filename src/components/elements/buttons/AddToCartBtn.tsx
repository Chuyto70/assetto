'use client';

import { useState } from 'react';

import { Product } from '@/lib/interfaces';

import Button from '@/components/elements/buttons/Button';

import { useAppDispatch } from '@/store';
import { increment } from '@/store/slice/cart';

export const AddToCartBtn = ({ product }: { product: Product }) => {
  const dispatch = useAppDispatch();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(product);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSelectedProduct({ ...product, selectedSize: size });
  };

  return (
    <>
      {product.attributes.sizes.map((size, index) => (
        <Button
          key={index}
          variant={selectedSize === size.size ? 'primary' : 'outline'}
          disabled={size.quantity === 0}
          onClick={() => handleSizeSelect(size.size)}
        >
          {size.size}
        </Button>
      ))}
      <Button
        variant='outline'
        onClick={() => dispatch(increment(selectedProduct))}
      >
        Add to cart
      </Button>
    </>
  );
};
