'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { Product } from '@/lib/interfaces';

import SingleProductCard from '@/components/elements/cards/SingleProductCard';

const AnimatePresence = dynamic(() =>
  import('framer-motion').then((mod) => mod.AnimatePresence)
);
const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div)
);

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
        <MotionDiv
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
        </MotionDiv>
      </AnimatePresence>
    </>
  );
}
