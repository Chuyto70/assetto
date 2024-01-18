'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useEffect, useRef, useState } from 'react';

import clsxm from '@/lib/clsxm';
import { includeLocaleLink } from '@/lib/helper';
import { LinkInterface } from '@/lib/interfaces';

import Link from '@/components/elements/links';

const MotionNav = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.nav)
);

const MotionLi = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.li)
);

const HeaderItem = ({
  className,
  name,
  sublinks,
  children,
}: {
  className?: string;
  name?: string;
  sublinks: LinkInterface[];
  children: ReactNode;
}) => {
  const menu = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const navVariants = {
    open: {
      display: 'flex',
      opacity: 1,
      transition: {
        type: 'spring',
        duration: 0.1,
        when: 'beforeChildren',
        delayChildren: 0.05,
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
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 24,
      },
    },
    closed: {
      opacity: 0,
      x: 50,
      transition: {
        duration: 0.1,
      },
    },
  };

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(event: MouseEvent) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (menu.current && !menu.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isOpen]);


  return (
    <span ref={menu}>
      <MotionLi
        className={clsxm('relative', className)}
        onClick={() => {
          if (sublinks.length > 0) {
            setIsOpen((state) => !state);
          }
        }}
      >
        {children}
        {/* SubMenu */}
        {sublinks.length > 0 && (
          <MotionNav
            initial={false}
            animate={isOpen ? 'open' : 'closed'}
            variants={navVariants}
            className='hidden absolute -z-10 top-full left-1/2 -translate-x-1/2 rounded-xl bg-carbon-200 dark:bg-carbon-900 mt-2 border-2 border-carbon-900 dark:border-carbon-200 before:absolute before:top-0 before:-translate-y-full before:left-1/2 before:-translate-x-1/2 before:border-l-8 before:border-r-8 before:border-b-8 before:border-b-carbon-900 dark:before:border-b-carbon-200 before:border-l-transparent before:border-r-transparent'
          >
            <span className='w-full h-full overflow-hidden p-6 flex-col gap-2'>
              {name && <h2 className='text-6xl uppercase pb-4'>{name}</h2>}
              <ul className='flex flex-col gap-3'>
                {sublinks.map((item) => (
                  <MotionLi key={item.id} variants={itemVariants}>
                    <Link
                      title={item.name}
                      href={includeLocaleLink(item.href)}
                      style={item.style}
                      icon={item.icon}
                      variant={item.variant}
                      rel={item.relationship}
                      size='xl'
                      className='whitespace-nowrap font-semibold dark:font-semibold'
                    >
                      {item.name}
                    </Link>
                  </MotionLi>
                ))}
              </ul>
            </span>
          </MotionNav>
        )}
      </MotionLi>
    </span>
  );
};

export default HeaderItem;
