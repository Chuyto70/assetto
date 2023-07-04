'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

import { HeaderItem } from '@/lib/interfaces';

import Link from '@/components/elements/links';

import { useServer } from '@/store/serverStore';

const MotionLi = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.li)
);

const HeaderDesktop = ({
  items,
  className,
}: {
  items: HeaderItem[];
  className: string;
}) => {
  const locale = useServer.getState().locale;
  const [isOpen, setIsOpen] = useState<{
    open: boolean;
    id?: number;
  }>({
    open: false,
  });

  return (
    <div className={className}>
      <ul className='flex justify-center gap-3 lg:gap-6'>
        {items.map((item) => (
          <MotionLi
            onHoverStart={() =>
              setIsOpen((state) => {
                return { open: !state.open, id: item.id };
              })
            }
            onHoverEnd={() =>
              setIsOpen((state) => {
                return { open: !state.open, id: undefined };
              })
            }
            key={item.id}
          >
            <Link
              href={`/${locale}/${item.link.href}`}
              style={item.link.style}
              icon={item.link.icon}
              variant={item.link.variants}
            >
              {item.link.name}
            </Link>
          </MotionLi>
        ))}
      </ul>

      {isOpen && <nav></nav>}
    </div>
  );
};

export default HeaderDesktop;
