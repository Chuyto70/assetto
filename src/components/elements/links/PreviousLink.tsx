'use client';

import { useRouter } from 'next/navigation';
import { forwardRef, ReactNode, useCallback } from 'react';

export type PreviousLinkProps = {
  children?: ReactNode;
  className?: string;
  dismissBack?: boolean;
  dismissAction?: () => void;
};

const PreviousLink = forwardRef<HTMLParagraphElement, PreviousLinkProps>(
  ({ children, className, dismissBack, dismissAction, ...rest }, ref) => {
    const router = useRouter();
    const onDismiss = useCallback(() => {
      dismissBack && router.back();
      dismissAction !== undefined && dismissAction();
    }, [dismissBack, router, dismissAction]);

    return (
      <p
        ref={ref}
        {...rest}
        className={className}
        onClick={onDismiss}
      >
        {children}
      </p>
    );
  }
);

export default PreviousLink;