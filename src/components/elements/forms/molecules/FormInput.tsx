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
import Input, { InputProps } from '@/components/elements/forms/atoms/Input';

export type FormInputProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  rules?: RegisterOptions;
  register?: UseFormRegister<TFormValues>;
  errors?: FieldErrors<TFormValues>;
  errorClassName?: string;
} & Omit<InputProps, 'name'>;

const FormInput = <TFormValues extends Record<string, unknown>>({
  name,
  register,
  rules,
  errors,
  className,
  errorClassName,
  ...rest
}: FormInputProps<TFormValues>): JSX.Element => {
  const errorMessage = (errors && get(errors, name)?.message) as string;

  return (
    <>
      <Input
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

export default FormInput;
