import { ReactNode } from 'react';

import clsxm from '@/lib/clsxm';

type FormErrorMessageProps = {
  children: ReactNode;
  className?: string;
};

const FormErrorMessage = ({ children, className }: FormErrorMessageProps) => {
  return <p className={clsxm('', className)}>{children}</p>;
};

export default FormErrorMessage;
