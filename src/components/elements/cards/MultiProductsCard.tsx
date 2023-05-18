'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { Product } from '@/lib/interfaces';

import SingleProductCard from '@/components/elements/cards/SingleProductCard';

export default function MultiProductsCard({
  products,
  imgSizes,
}: {
  products: Product[];
  imgSizes?: string;
}) {
  const [selectedCard, setSelectedCard] = useState(products[0]);

  const changeSelectedCard = (id: number) => {
    const newSelectedCard = products.find((product) => product.id === id);
    if (newSelectedCard) setSelectedCard(newSelectedCard);
  };
  return (
    <>
      <AnimatePresence mode='wait' initial={false}>
        <motion.div
          key={selectedCard ? selectedCard.id : 'empty'}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SingleProductCard
            product={selectedCard}
            imgSizes={imgSizes}
            colorSwitch={changeSelectedCard}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
