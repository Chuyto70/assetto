'use client';

import dynamic from "next/dynamic";
import { ReactNode, useState } from "react";

const AnimatePresence = dynamic(() => import('framer-motion').then((mod) => mod.AnimatePresence));
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div));

const Accordion = (props: { children?: ReactNode; className?: string; response: ReactNode; initialOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(props.initialOpen ?? false);


  return (
    <MotionDiv
      className={props.className}
      onClick={() => setIsOpen((state) => !state)}
    >
      {props.children}
      <MotionDiv
        initial={isOpen ? 'open' : 'collapsed'}
        animate={isOpen ? 'open' : 'collapsed'}
        variants={{
          open: { opacity: 1, height: "auto" },
          collapsed: { opacity: 0, height: 0 }
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {props.response}
      </MotionDiv>
    </MotionDiv>
  )
}

export default Accordion;