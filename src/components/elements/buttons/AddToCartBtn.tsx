'use client';

import { useState } from 'react';

import { Product } from '@/lib/interfaces';

import Button from '@/components/elements/buttons/Button';

import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';

export const AddToCartBtn = ({ product }: { product: Product }) => {
  const increment = useCart().increment;
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(product);

  const translations = useServer.getState().translations;

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
      <Button variant='outline' onClick={() => increment(selectedProduct)}>
        {translations.add_to_cart_btn}
      </Button>
    </>
  );
};
