import * as React from 'react';

import clsxm from '@/lib/clsxm';

import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/elements/links/UnstyledLink';

const PrimaryLinkVariant = ['primary', 'basic'] as const;
export type PrimaryLinkProps = {
  variant?: (typeof PrimaryLinkVariant)[number];
} & UnstyledLinkProps;

const PrimaryLink = React.forwardRef<HTMLAnchorElement, PrimaryLinkProps>(
  ({ className, children, variant = 'primary', ...rest }, ref) => {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={clsxm(
          'inline-flex items-center',
          'focus-visible:ring-primary-600 focus:outline-none focus-visible:rounded focus-visible:ring focus-visible:ring-offset-2',
          'font-normal dark:font-light',
          //#region  //*=========== Variant ===========
          variant === 'primary' && [
            'text-carbon-900 dark:text-white hover:text-primary-600 active:text-primary-600 focus:text-primary-600',
            'disabled:text-primary-800',
          ],
          variant === 'basic' && [
            'text-carbon-900 hover:text-carbon-700 active:text-carbon-800',
            'disabled:text-carbon-300',
          ],
          //#endregion  //*======== Variant ===========
          className
        )}
      >
        {children}
      </UnstyledLink>
    );
  }
);

export default PrimaryLink;
