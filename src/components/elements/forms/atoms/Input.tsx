import { forwardRef } from 'react';

import clsxm from '@/lib/clsxm';

export type InputProps = {
  label: string;
} & React.ComponentPropsWithRef<'input'>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        aria-label={label}
        className={clsxm('form-input', className)}
        {...rest}
      />
    );
  }
);

export default Input;
