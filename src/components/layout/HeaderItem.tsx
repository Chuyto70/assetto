'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { LinkInterface } from '@/lib/interfaces';

import Link from '@/components/elements/links';

const MotionNav = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.nav)
);

const MotionLi = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.li)
);

const HeaderItem = ({
  name,
  sublinks,
  children,
}: {
  name: string;
  sublinks: LinkInterface[];
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navVariants = {
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

  // delete timeout when unmounting
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <MotionLi
      onHoverStart={() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (sublinks.length > 0) {
          setIsOpen(true);
        }
      }}
      onHoverEnd={() => {
        timeoutRef.current = setTimeout(() => {
          setIsOpen(false);
        }, 300);
      }}
    >
      {children}
      {/* SubMenu */}
      {sublinks.length > 0 && (
        <MotionNav
          animate={isOpen ? 'open' : 'closed'}
          variants={navVariants}
          className='hidden absolute -z-10 top-20 left-0 w-full bg-secondary-100 p-6 lg:px-12 flex-col gap-2'
        >
          <h2 className='text-6xl uppercase pb-4'>{name}</h2>
          <ul className='flex flex-row gap-6'>
            {sublinks.map((item) => (
              <MotionLi key={item.id} variants={itemVariants}>
                <Link
                  href={item.href}
                  style={item.style}
                  icon={item.icon}
                  variant={item.variant}
                  size='xl'
                >
                  {item.name}
                </Link>
              </MotionLi>
            ))}
          </ul>
        </MotionNav>
      )}
    </MotionLi>
  );
};

export default HeaderItem;
