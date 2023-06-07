'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import style from './Switch.module.css';

import clsxm from '@/lib/clsxm';

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
          isDark ? style.switchDark : style.switch,
          isOn && style.switchOn,
          className
        )}
        onClick={toggleSwitch}
        {...rest}
      >
        <motion.div className={style.handle} layout transition={spring} />
      </div>
    );
  }
);

export default Switch;
