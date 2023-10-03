import { forwardRef } from 'react';

import clsxm from '@/lib/clsxm';

export type TextAreaProps = {
  label: string;
} & React.ComponentPropsWithRef<'textarea'>;

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, className, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-label={label}
        className={clsxm('form-textarea', className)}
        {...rest}
      />
    );
  }
);

export default TextArea;
