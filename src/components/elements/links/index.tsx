import dynamic from 'next/dynamic';
import { forwardRef, ReactNode } from 'react';

import { ENUM_ELEMENTS_LINK_STYLE } from '@/lib/interfaces';

import { ButtonLinkProps } from '@/components/elements/links/ButtonLink';
import { IconLinkProps } from '@/components/elements/links/IconLink';
import { PrimaryLinkProps } from '@/components/elements/links/PrimaryLink';
import { UnstyledLinkProps } from '@/components/elements/links/UnstyledLink';

export type LinksProps = {
  style: ENUM_ELEMENTS_LINK_STYLE;
  children: ReactNode;
} & (UnstyledLinkProps | PrimaryLinkProps | IconLinkProps | ButtonLinkProps) &
  React.ComponentPropsWithRef<'a'>;

// Map Link to proprer component
const link = {
  primary: dynamic(() => import('@/components/elements/links/PrimaryLink')),
  underline: dynamic(() => import('@/components/elements/links/UnderlineLink')),
  button: dynamic(() => import('@/components/elements/links/ButtonLink')),
  icon: dynamic(() => import('@/components/elements/links/IconLink')),
  arrow: dynamic(() => import('@/components/elements/links/ArrowLink')),
  none: dynamic(() => import('@/components/elements/links/UnstyledLink')),
};

const Link = forwardRef<HTMLAnchorElement, LinksProps>(
  ({ style, children, ...rest }, ref) => {
    const Link = link[style as keyof typeof link];

    return (
      <Link ref={ref} {...rest}>
        {children}
      </Link>
    );
  }
);

export default Link;
