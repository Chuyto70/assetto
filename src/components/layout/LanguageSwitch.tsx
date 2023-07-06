'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { ENUM_ELEMENTS_LINK_STYLE } from '@/lib/interfaces';

import Link from '@/components/elements/links';

import { useServer } from '@/store/serverStore';

const MotionButton = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.button)
);

const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div)
);

const LanguageSwitch = () => {
  const [isOpen, setIsOpen] = useState(false);

  const locales = useServer.getState().locales;
  const locale = useServer.getState().locale;

  const current = locales?.find((el) => el.attributes.code === locale);

  return (
    <>
      <MotionButton onClick={() => setIsOpen((state) => !state)}>
        {current?.attributes.name}
      </MotionButton>

      <MotionDiv
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        className='hidden z-50 absolute top-0 left-0 w-full h-screen bg-carbon-900 opacity-60 justify-center items-center'
      >
        <div className=' '>
          {locales?.map((el) => (
            <Link
              key={el.attributes.code}
              href={`/${el.attributes.code}`}
              style={ENUM_ELEMENTS_LINK_STYLE.arrow}
            >
              {el.attributes.name}
            </Link>
          ))}
        </div>
      </MotionDiv>
    </>
  );
};

export default LanguageSwitch;
