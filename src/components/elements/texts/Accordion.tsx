'use client';

import dynamic from "next/dynamic";
import { ReactNode, useState } from "react";

const AnimatePresence = dynamic(() => import('framer-motion').then((mod) => mod.AnimatePresence));
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div));

const Accordion = (props: { children?: ReactNode; response: ReactNode; initialOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(props.initialOpen ?? false);


  return (
    <MotionDiv
      onClick={() => setIsOpen((state) => !state)}
    >
      {props.children}
      <AnimatePresence>
        {isOpen && <MotionDiv
          initial={isOpen ? 'open' : 'collapsed'}
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 }
          }}
          transition={{ duration: 0.3 }}
        >
          {props.response}
        </MotionDiv>}
      </AnimatePresence>
    </MotionDiv>
  )
}

export default Accordion;