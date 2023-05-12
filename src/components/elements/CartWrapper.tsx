'use client';

import { useState } from 'react';

import { Product } from '@/lib/interfaces';

import { AddToCartBtn } from '@/components/elements/buttons/AddToCartBtn';
import Button from '@/components/elements/buttons/Button';

export const CartWrapper = ({ product }: { product: Product }) => {
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
      <AddToCartBtn product={selectedProduct} displayQty={true}></AddToCartBtn>
    </>
  );
};
