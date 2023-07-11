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
  toggleClassName?: string;
  icon?: React.ReactNode;
} & React.ComponentPropsWithRef<'div'>;

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(
  ({ className, isDark = false, toggleIsOn = false, toggle, toggleClassName, icon, ...rest }, ref) => {
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
          isDark ? 'bg-carbon-800/40' : 'bg-carbon-200/40',
          'flex items-center cursor-pointer justify-start rounded-full p-[0.1em] transition-colors duration-300 w-[2em] h-[1em]',
          isOn && 'justify-end',
          className
        )}
        onClick={toggleSwitch}
        {...rest}
      >
        <MotionDiv
          className={clsxm(
            isDark ? 'bg-white' : 'bg-carbon-900',
            'rounded-full w-[0.8em] h-[0.8em] flex justify-center items-center',
            toggleClassName
          )}
          layout
          transition={spring}
        >
          {icon}
        </MotionDiv>
      </div>
    );
  }
);

export default Switch;
