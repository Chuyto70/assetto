import * as React from 'react';

import clsxm from '@/lib/clsxm';

import DynamicIcon from '@/components/elements/DynamicIcon';
import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/elements/links/UnstyledLink';

const IconLinkVariant = [
  'primary',
  'outline',
  'ghost',
  'light',
  'dark',
] as const;

export type IconLinkProps = {
  isDarkBg?: boolean;
  variant?: (typeof IconLinkVariant)[number];
  icon?: string;
  family?: string;
} & Omit<UnstyledLinkProps, 'children'>;

const IconLink = React.forwardRef<HTMLAnchorElement, IconLinkProps>(
  (
    { className, icon, family, variant = 'outline', isDarkBg = false, ...rest },
    ref
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        type='button'
        className={clsxm(
          'inline-flex items-center justify-center rounded font-medium',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-75',
          'min-h-[28px] min-w-[28px] p-1 md:min-h-[34px] md:min-w-[34px] md:p-2',
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              'bg-primary-200 text-dark',
              'border-primary-300 border',
              'hover:bg-primary-300 hover:text-dark',
              'active:bg-primary-400',
              'disabled:bg-primary-400',
            ],
            variant === 'outline' && [
              'text-primary-200',
              'border-primary-200 border',
              'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'ghost' && [
              'text-primary-500',
              'shadow-none',
              'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
              isDarkBg &&
                'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
            ],
            variant === 'light' && [
              'bg-white text-gray-700',
              'border border-gray-300',
              'hover:text-dark hover:bg-gray-100',
              'active:bg-white/80 disabled:bg-gray-200',
            ],
            variant === 'dark' && [
              'bg-gray-900 text-white',
              'border border-gray-600',
              'hover:bg-gray-800 active:bg-gray-700 disabled:bg-gray-700',
            ],
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          className
        )}
        {...rest}
      >
        {icon && family && <DynamicIcon icon={icon} />}
      </UnstyledLink>
    );
  }
);

export default IconLink;
