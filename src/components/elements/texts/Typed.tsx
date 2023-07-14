'use client';

import { ReactNode, useEffect, useRef, useState } from "react";
import TypedJS from 'typed.js';

const Typed = ({ children, texts }: { children?: ReactNode; texts: string[] }) => {
  // Create reference to store the DOM element containing the animation
  const el = useRef(null);
  // Check if client component is mounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) setIsMounted(true);
    else {
      const typed = new TypedJS(el.current, {
        strings: texts,
        typeSpeed: 50,
        loop: true,
        loopCount: Infinity,
      }
      );

      return () => {
        // Destroy Typed instance during cleanup to stop animation
        typed.destroy();
      };
    }
  }, [isMounted, texts]);

  return (
    <>
      {isMounted ?
        <span>
          <span ref={el} />
        </span> : children
      }
    </>
  );
}

export default Typed;