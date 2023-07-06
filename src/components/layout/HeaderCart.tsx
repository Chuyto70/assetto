'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useState } from 'react';

import { CartItemCard } from '@/components/elements/cards/CartItemCard';
import ButtonLink from '@/components/elements/links/ButtonLink';

import useStore from '@/store';
import { useCart } from '@/store/cartStore';
import { useServer } from '@/store/serverStore';

const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div)
);

const HeaderCart = ({
  children,
  cartPage,
}: {
  children?: ReactNode;
  cartPage: string;
}) => {
  const cartItems = useStore(useCart, (state) => state.cartItems);
  const cartTotalPrice = useStore(useCart, (state) => state.totalPrice) ?? 0;
  const translations = useServer.getState().translations;
  const [isOpen, setIsOpen] = useState(false);

  const divVariants = {
    open: {
      display: 'flex',
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        delayChildren: 0.3,
        staggerChildren: 0.05,
      },
    },
    closed: {
      display: 'none',
      opacity: 0,
      transition: {
        when: 'afterChildren',
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <MotionDiv
      onClick={() => setIsOpen((state) => !state)}
      className='cursor-pointer'
    >
      {children}
      {/* Cart */}
      <MotionDiv
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={divVariants}
        className='bg-secondary-100 top-0 md:top-20 left-0 md:left-auto md:right-0 absolute -z-10 w-full md:max-w-md h-fit max-h-screen hidden flex-col items-center gap-3 pt-20 px-3 pb-3 md:p-6'
      >
        {cartItems?.map((item, index) => (
          <MotionDiv key={index} variants={itemVariants}>
            <CartItemCard cartItem={item} className='text-base' />
          </MotionDiv>
        ))}
        {!cartItems?.length && (
          <MotionDiv variants={itemVariants}>
            <p>{translations.cart?.empty}</p>
          </MotionDiv>
        )}
        <MotionDiv
          variants={itemVariants}
          className='w-full border-carbon-900 flex justify-between border-t-2 pt-4 text-base font-bold md:pt-8'
        >
          <p>{translations.total}</p>
          <p>{cartTotalPrice} €</p>
        </MotionDiv>
        <MotionDiv variants={itemVariants} className='w-full'>
          <ButtonLink
            href={cartPage}
            variant='dark'
            className='w-full justify-center'
          >
            {translations.cart.validate_btn}
          </ButtonLink>
        </MotionDiv>
      </MotionDiv>
    </MotionDiv>
  );
};

export default HeaderCart;
