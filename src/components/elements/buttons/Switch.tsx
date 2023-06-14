'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

import clsxm from '@/lib/clsxm';

const MotionDiv = dynamic(() =>
  import('framer-motion').then((mod) => mod.motion.div)
);

type SwitchProps = {
  isDark?: boolean;
  toggleIsOn?: boolean;
  toggle?: (isOn: boolean) => void;
} & React.ComponentPropsWithRef<'div'>;

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ className, isDark = false, toggleIsOn = false, toggle, ...rest }, ref) => {
    const [isOn, setIsOn] = useState(toggleIsOn);
    const toggleSwitch = () => {
      if (toggle !== undefined) toggle(!isOn);
      setIsOn(!isOn);
    };

    useEffect(() => {
      setIsOn(toggleIsOn);
    }, [toggleIsOn]);

    const spring = {
      type: 'spring',
      stiffness: 700,
      damping: 30,
    };

    return (
      <div
        ref={ref}
        className={clsxm(
          isDark ? 'bg-dark/40' : 'bg-gray-200/40',
          isOn && 'justify-end',
          'flex cursor-pointer justify-start rounded-full p-[0.1em] transition-colors duration-300 w-[2em] h-[1em]',
          className
        )}
        onClick={toggleSwitch}
        {...rest}
      >
        <MotionDiv
          className='rounded-full bg-white w-[0.8em] h-[0.8em]'
          layout
          transition={spring}
        />
      </div>
    );
  }
);

export default Switch;
