'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { graphQLProductProps } from '@/lib/graphql';

import SingleProductCard from '@/components/elements/SingleProductCard';

export default function MultiProductsCard({
  locale,
  products,
  imgSizes,
}: {
  locale: string;
  products: graphQLProductProps[];
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
            locale={locale}
            product={selectedCard}
            imgSizes={imgSizes}
            colorSwitch={changeSelectedCard}
          />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
