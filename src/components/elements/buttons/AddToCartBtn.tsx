'use client';

import { useState } from 'react';

import { Product } from '@/lib/interfaces';

import Button from '@/components/elements/buttons/Button';

import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

export const AddToCartBtn = ({ product }: { product: Product }) => {
  const increment = useCart().increment;
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(product);

  const notify = useToaster((state) => state.notify);

  const translations = useServer.getState().translations;

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    setSelectedProduct({ ...product, selectedSize: size });
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      increment(selectedProduct);
      notify(0, <p>!Produit ajouté au panier</p>);
    } else {
      notify(3, <p>!Vous devez d'abord selectionner une taille</p>);
    }
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
      <Button variant='outline' onClick={handleAddToCart}>
        {translations.add_to_cart_btn}
      </Button>
    </>
  );
};
