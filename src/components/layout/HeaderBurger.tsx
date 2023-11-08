'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import { HeaderItem } from '@/lib/interfaces';

import ThemeSwitch from '@/components/elements/buttons/ThemeSwitch';
import DynamicIcon from '@/components/elements/DynamicIcon';
import Link from '@/components/elements/links';
import SettingsButton from '@/components/layout/SettingsButton';
import NextImage from '@/components/NextImage';

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

const HeaderBurger = ({
  items,
  className,
}: {
  items: HeaderItem[];
  className?: string;
}) => {
  const navRef = useRef<HTMLSpanElement>(null);
  const ulRef = useRef<HTMLSpanElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [subIsOpen, setSubIsOpen] = useState(false);

  const ulVariants = {
    open: {
      display: 'flex',
      opacity: 1,
      transition: {
        when: 'beforeChildren',
        delayChildren: 0.1,
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

  useEffect(() => {
    if (!isOpen) return;
    function handleClick({ target }: MouseEvent) {
      if (
        navRef.current &&
        ulRef.current &&
        !navRef.current.contains(target as Node) &&
        !ulRef.current.contains(target as Node)
      ) {
        setIsOpen(false);
      }
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isOpen]);

  return (
    <span ref={navRef} className={className}>
      <MotionNav initial={false} animate={isOpen ? 'open' : 'closed'}>
        <MotionButton
          onClick={() => setIsOpen(!isOpen)}
          className='h-8 w-8 p-0'
          aria-label='menu'
        >
          <DynamicIcon
            icon='material-symbols:menu-rounded'
            className='h-full w-full text-carbon-900 dark:text-white'
          />
        </MotionButton>
        <span ref={ulRef}>
          <MotionUl
            variants={ulVariants}
            className='bg-carbon-200 dark:bg-carbon-900 top-0 left-0 absolute -z-10 w-full h-screen max-h-screen hidden flex-col items-center gap-3 pt-20 pb-10'
          >
            {items.map((item) => (
              <MotionLi
                variants={itemVariants}
                key={item.id}
                className='w-full mx-3 flex flex-col items-center'
              >
                <span className='inline-flex items-center gap-1'>
                  <Link
                    href={item.link.href}
                    style={item.link.style}
                    icon={item.link.icon}
                    variant={item.link.variant}
                    openNewTab={item.link.open_new_tab}
                    className='flex w-full justify-center font-bold dark:font-bold'
                    onClick={() => setIsOpen((state) => !state)}
                  >
                    {item.link.name}
                  </Link>
                  {item.sublinks.length > 0 && <MotionButton onClick={() => setSubIsOpen((state) => !state)}>
                    <DynamicIcon
                      icon='material-symbols:keyboard-arrow-down-rounded'
                      className='h-8 w-8 text-carbon-900 dark:text-white'
                    />
                  </MotionButton>}
                </span>

                {item.sublinks.length > 0 && subIsOpen && (
                  <ul className='pt-2 pb-6 flex flex-col item-center gap-3 text-sm font-normal'>
                    {item.sublinks.map((subItem) => (
                      <li key={subItem.id} className='flex justify-center'>
                        <Link
                          href={subItem.href}
                          style={subItem.style}
                          icon={subItem.icon}
                          openNewTab={item.link.open_new_tab}
                          variant={subItem.variant}
                          className='font-semibold dark:font-semibold'
                          onClick={() => setIsOpen((state) => !state)}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </MotionLi>
            ))}

            <MotionLi
              variants={itemVariants}
              className='w-full mx-3 flex justify-between p-3'
            >
              <div className='h-10 w-20'><ThemeSwitch /></div>
              <SettingsButton className='h-10 rounded-full flex items-center p-1 px-2 gap-1 bg-carbon-200 dark:bg-carbon-900 shadow-carbon-200-inner dark:shadow-carbon-900-inner'>
                <NextImage src="/images/setting-dynamic-color.png" quality={100} width={30} height={30} alt="3d settings icon" />
              </SettingsButton>
            </MotionLi>
          </MotionUl>
        </span>
      </MotionNav>
    </span>
  );
};

export default HeaderBurger;
