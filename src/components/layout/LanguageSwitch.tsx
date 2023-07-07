'use client';

import dynamic from 'next/dynamic';
import { ReactNode, useEffect, useRef, useState } from 'react';

import { ENUM_ELEMENTS_LINK_STYLE } from '@/lib/interfaces';

import DynamicIcon from '@/components/elements/DynamicIcon';
import Link from '@/components/elements/links';

import { useServer } from '@/store/serverStore';

const MotionButton = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.button)
);

const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div)
);

const LanguageSwitch = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  const menuRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLSpanElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const locales = useServer.getState().locales;

  const divVariant = {
    open: {
      display: 'flex',
      opacity: 1,
      transition: {
        when: 'beforeChildren',
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

  const wrapVariant = {
    open: {
      scale: 1,
      transition: {
        when: 'beforeChildren',
        delayChildren: 0.3,
        staggerChildren: 0.05,
      },
    },
    closed: {
      scale: 0,
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
        stiffness: 300,
        damping: 24,
      },
    },
    closed: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  useEffect(() => {
    if (!isOpen) return;
    function handleClick({ target }: MouseEvent) {
      if (
        menuRef.current &&
        btnRef &&
        !menuRef.current.contains(target as Node) &&
        !btnRef.current?.contains(target as Node)
      ) {
        setIsOpen(false);
      }
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isOpen]);

  return (
    <>
      <span ref={btnRef}>
        <MotionButton
          onClick={() => setIsOpen((state) => !state)}
          className={className}
        >
          {children}
        </MotionButton>
      </span>

      <MotionDiv
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={divVariant}
        className='z-50 fixed top-0 left-0 w-full h-screen bg-carbon-900/60 opacity-60 justify-center items-center'
      >
        <span ref={menuRef}>
          <MotionDiv
            className='max-w-screen-xs flex flex-wrap gap-3 p-3 bg-primary-100 rounded-md text-carbon-900 font-bold'
            variants={wrapVariant}
          >
            {locales?.map((locale) => (
              <MotionDiv key={locale.attributes.code} variants={itemVariants}>
                <Link
                  href={`/${locale.attributes.code}`}
                  style={ENUM_ELEMENTS_LINK_STYLE.none}
                  onClick={() => setIsOpen(false)}
                  className='flex items-center justify-center gap-1'
                >
                  <DynamicIcon
                    icon={`flagpack:${
                      locale.attributes.code === 'en'
                        ? 'gb-ukm'
                        : locale.attributes.code
                    }`}
                    className='w-8 h-fit rounded-sm overflow-hidden'
                  />
                  <span>{locale.attributes.name}</span>
                </Link>
              </MotionDiv>
            ))}
          </MotionDiv>
        </span>
      </MotionDiv>
    </>
  );
};

export default LanguageSwitch;
