'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { InferType, object, string } from 'yup';

import clsxm from '@/lib/clsxm';

import Button from '@/components/elements/buttons/Button';
import FormInput from '@/components/elements/forms/molecules/FormInput';

import { useToaster } from '@/store/toasterStore';

const schema = object({
  email: string()
    .email("!Votre adresse email n'est pas valide")
    .required('!Une email est requise'),
  name: string().required("!Un nom est requis"),
  subject: string().min(5, '!Minimum 5 caracters').required("!Un sujet est requis"),
  message: string().min(5, '!Minimum 5 caracters').required("!Un message est requis"),
}).required();

export type ContactFormType = InferType<typeof schema>;

const ContactForm = ({
  placeholder,
  submitText,
  className,
}: {
  placeholder?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
  labels: {
    name: string;
    email: string;
    subject: string;
    message: string;
  },
  submitText: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}) => {
  const notify = useToaster((state) => state.notify);

  const { formState: { errors }, handleSubmit, register } = useForm<ContactFormType>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: true,
  });

  const submitContact = (data: ContactFormType) => {
    // submit contact
  };

  return (
    <form
      onSubmit={handleSubmit(submitContact)}
      className={clsxm(
        className
      )}
    >
      <FormInput
        name='email'
        label='Email'
        placeholder={placeholder?.email}
        className="rounded-full w-full py-2 px-3 border-2 border-carbon-700 bg-transparent placeholder:text-carbon-700 text-sm md:text-base"
        register={register}
        errors={errors}
        errorClassName='text-red-600 text-sm'
      />

      <FormInput
        name='subject'
        label='Subject'
        placeholder={placeholder?.subject}
        className="rounded-full w-full py-2 px-3 border-2 border-carbon-700 bg-transparent placeholder:text-carbon-700 text-sm md:text-base"
        register={register}
        errors={errors}
        errorClassName='text-red-600 text-sm'
      />
      <Button
        type='submit'
        variant='primary'
        className='py-2 px-3 justify-center text-sm: md:text-base w-fit'
      >{submitText}</Button>
    </form>
  );
};

export default ContactForm;
