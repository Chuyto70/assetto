'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { HiBars2, HiOutlineXMark } from 'react-icons/hi2';

import { HeaderItem } from '@/lib/interfaces';

import Link from '@/components/elements/links';

import { useServer } from '@/store/serverStore';

const MotionNav = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.nav)
);

const MotionButton = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.button)
);

const MotionUl = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.ul)
);

const MotionLi = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.li)
);

const HeaderBurger = ({ items }: { items: HeaderItem[] }) => {
  const locale = useServer.getState().locale;
  const [isOpen, setIsOpen] = useState(false);

  const ulVariants = {
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
    <>
      <MotionNav initial={false} animate={isOpen ? 'open' : 'closed'}>
        <MotionButton
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsOpen(!isOpen)}
          className='h-8 w-8 p-0'
        >
          {isOpen ? (
            <HiOutlineXMark className='h-full w-full text-carbon-900' />
          ) : (
            <HiBars2 className='h-full w-full text-carbon-900' />
          )}
        </MotionButton>
        <MotionUl
          variants={ulVariants}
          className='bg-secondary-100 top-0 left-0 absolute -z-10 w-full h-fit max-h-screen hidden flex-col items-center gap-3 pt-20 pb-10 text-lg font-bold'
        >
          {items.map((item) => (
            <MotionLi
              variants={itemVariants}
              key={item.id}
              className='w-full mx-3'
            >
              <Link
                href={`/${locale}/${item.link.href}`}
                style={item.link.style}
                family={item.link.icon_family}
                icon={item.link.icon}
                variant={item.link.variants}
                className='flex w-full justify-center'
              >
                {item.link.name}
              </Link>
              {item.sublinks.length > 0 && (
                <ul className='pt-2 px-2 w-full max-w-full overflow-x-scroll flex flex-nowrap gap-3 no-scrollbar'>
                  {item.sublinks.map((subItem) => (
                    <li key={subItem.id}>
                      <Link
                        href={`/${locale}/${subItem.href}`}
                        style={subItem.style}
                        family={subItem.icon_family}
                        icon={subItem.icon}
                        variant={subItem.variants}
                        size='lg'
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </MotionLi>
          ))}
        </MotionUl>
      </MotionNav>
    </>
  );
};

export default HeaderBurger;
