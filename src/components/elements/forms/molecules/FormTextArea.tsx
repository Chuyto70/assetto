'use client';

import {
  FieldErrors,
  FieldValues,
  get,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

import FormErrorMessage from '@/components/elements/forms/atoms/FormErrorMessage';
import TextArea, { TextAreaProps } from '@/components/elements/forms/atoms/TextArea';

export type FormTextAreaProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  rules?: RegisterOptions;
  register?: UseFormRegister<TFormValues>;
  errors?: FieldErrors<TFormValues>;
  errorClassName?: string;
} & Omit<TextAreaProps, 'name'>;

const FormTextArea = <TFormValues extends Record<string, unknown>>({
  name,
  register,
  rules,
  errors,
  className,
  errorClassName,
  ...rest
}: FormTextAreaProps<TFormValues>): JSX.Element => {
  const errorMessage = (errors && get(errors, name)?.message) as string;

  return (
    <>
      <TextArea
        name={name}
        className={className}
        {...rest}
        {...(register && register(name, rules))}
      />
      {errorMessage && (
        <FormErrorMessage className={errorClassName}>
          {errorMessage}
        </FormErrorMessage>
      )}
    </>
  );
};

export default FormTextArea;
