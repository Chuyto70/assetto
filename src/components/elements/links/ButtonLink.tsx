import * as React from 'react';

import clsxm from '@/lib/clsxm';

import DynamicIcon from '@/components/elements/DynamicIcon';
import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/elements/links/UnstyledLink';

const ButtonLinkVariant = [
  'primary',
  'outline',
  'ghost',
  'light',
  'dark',
] as const;
const ButtonLinkSize = ['sm', 'base', 'md', 'lg', 'xl'] as const;

export type ButtonLinkProps = {
  isDarkBg?: boolean;
  variant?: (typeof ButtonLinkVariant)[number];
  size?: (typeof ButtonLinkSize)[number];
  leftIcon?: string;
  rightIcon?: string;
  leftIconClassName?: string;
  rightIconClassName?: string;
} & UnstyledLinkProps;

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'base',
      isDarkBg = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      leftIconClassName,
      rightIconClassName,
      ...rest
    },
    ref
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={clsxm(
          'inline-flex items-center rounded-full',
          'focus-visible:ring-primary-300 focus:outline-none focus-visible:ring',
          'transition-colors duration-75',
          //#region  //*=========== Size ===========
          [
            size === 'xl' && ['px-4 py-2', 'text-lg md:text-xl'],
            size === 'lg' && ['px-4 py-2', 'text-md md:text-lg'],
            size === 'md' && ['px-3 py-1.5', 'text-base md:text-md'],
            size === 'base' && ['px-3 py-1.5', 'text-sm md:text-base'],
            size === 'sm' && ['px-2 py-1', 'text-xs md:text-sm'],
          ],
          //#endregion  //*======== Size ===========
          //#region  //*=========== Variants ===========
          [
            variant === 'primary' && [
              'bg-primary-200 text-carbon-900 dark:bg-primary-600 dark:text-white',
              'hover:bg-primary-300 hover:text-carbon-900 dark:hover:bg-primary-400 dark:hover:text-white',
              'active:bg-primary-300 dark:active:bg-primary-400',
              'disabled:bg-primary-300 dark:disabled:bg-primary-400',
            ],
            variant === 'outline' && [
              'text-primary-200',
              'border-primary-200 border',
              'hover:bg-primary-300 active:bg-primary-300 disabled:bg-primary-300',
              isDarkBg &&
              'hover:text-carbon-900 active:text-carbon-800 disabled:text-carbon-700',
            ],
            variant === 'ghost' && [
              'text-primary-200',
              'shadow-none',
              'hover:bg-primary-300 active:bg-primary-300 disabled:bg-primary-300',
              isDarkBg &&
              'hover:text-carbon-900 active:text-carbon-800 disabled:text-carbon-700',
            ],
            variant === 'light' && [
              'bg-carbon-50 text-carbon-900',
              'border border-carbon-300',
              'hover:text-carbon-900 hover:bg-carbon-100',
              'active:bg-white/80 disabled:bg-carbon-200',
            ],
            variant === 'dark' && [
              'bg-carbon-900 text-white',
              'border border-carbon-600',
              'hover:bg-carbon-800 active:bg-carbon-700 disabled:bg-carbon-700',
            ],
          ],
          //#endregion  //*======== Variants ===========
          'disabled:cursor-not-allowed',
          className
        )}
      >
        {LeftIcon && (
          <div
            className={clsxm([
              size === 'base' && 'mr-1',
              size === 'sm' && 'mr-1.5',
            ])}
          >
            <DynamicIcon
              icon={LeftIcon}
              className={clsxm(
                [
                  size === 'base' && 'md:text-md text-md',
                  size === 'sm' && 'md:text-md text-sm',
                ],
                leftIconClassName
              )}
            />
          </div>
        )}
        {children}
        {RightIcon && (
          <div
            className={clsxm([
              size === 'base' && 'ml-1',
              size === 'sm' && 'ml-1.5',
            ])}
          >
            <DynamicIcon
              icon={RightIcon}
              className={clsxm(
                [
                  size === 'base' && 'text-md md:text-md',
                  size === 'sm' && 'md:text-md text-sm',
                ],
                rightIconClassName
              )}
            />
          </div>
        )}
      </UnstyledLink>
    );
  }
);

export default ButtonLink;
