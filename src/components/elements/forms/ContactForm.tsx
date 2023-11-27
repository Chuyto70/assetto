'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { get, useForm } from 'react-hook-form';
import { InferType, object, string } from 'yup';

import clsxm from '@/lib/clsxm';

import Button from '@/components/elements/buttons/Button';
import FormInput from '@/components/elements/forms/molecules/FormInput';
import FormTextArea from '@/components/elements/forms/molecules/FormTextArea';

import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

import { sendContactMail } from '@/actions/strapi/send-contact-mail';

const translations = useServer.getState().translations;

const schema = object({
  email: string()
    .email(translations.forms?.invalid_email ?? 'invalid email')
    .required(translations.forms?.required_email ?? 'required email'),
  name: string().required(translations.forms?.required_name ?? 'required name'),
  subject: string().min(5, translations.forms?.min ?? 'This should be longer').required(translations.forms?.required_subject ?? 'required subject'),
  message: string().min(5, translations.forms?.min ?? 'This should be longer').required(translations.forms?.required_message ?? 'required message'),
}).required();

export type ContactFormType = InferType<typeof schema>;

const ContactForm = ({
  placeholder,
  label,
  submitText,
  className,
}: {
  placeholder?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  };
  label: {
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
  const locale = useServer((state) => state.locale);
  const notify = useToaster((state) => state.notify);

  const { formState: { errors }, handleSubmit, register } = useForm<ContactFormType>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: true,
  });

  const submitContact = (data: ContactFormType) => {
    sendContactMail(locale, data)
      .then(() =>
        notify(
          0,
          <p>
            {translations.forms?.request_sent ?? 'request sent'}
          </p>
        )
      )
      .catch(() =>
        notify(
          1,
          <p>
            {translations.forms?.request_error ?? 'request error'}
          </p>
        )
      );
  };

  return (
    <form
      onSubmit={handleSubmit(submitContact)}
      className={clsxm(
        className
      )}
    >

      <span className='w-full'>
        {label.name && <label htmlFor="Name">{label.name}</label>}
        <FormInput
          name='name'
          label='Name'
          placeholder={placeholder?.name}
          className={clsxm("rounded-full w-full mt-1 py-2 px-3 border-2 border-carbon-700 dark:bg-carbon-900 placeholder:text-carbon-700 dark:placeholder:text-carbon-400 text-sm md:text-base", get(errors, 'name') && 'border-red-600')}
          register={register}
          errors={errors}
          errorClassName='text-red-600 text-sm'
        />
      </span>

      <span className='w-full'>
        {label.email && <label htmlFor="Email">{label.email}</label>}
        <FormInput
          name='email'
          label='Email'
          placeholder={placeholder?.email}
          className={clsxm("rounded-full w-full mt-1 py-2 px-3 border-2 border-carbon-700 dark:bg-carbon-900 placeholder:text-carbon-700 dark:placeholder:text-carbon-400 text-sm md:text-base", get(errors, 'email') && 'border-red-600')}
          register={register}
          errors={errors}
          errorClassName='text-red-600 text-sm'
        />
      </span>

      <span className='w-full'>
        {label.subject && <label htmlFor="Subject">{label.subject}</label>}
        <FormInput
          name='subject'
          label='Subject'
          placeholder={placeholder?.subject}
          className={clsxm("rounded-full w-full mt-1 py-2 px-3 border-2 border-carbon-700 dark:bg-carbon-900 placeholder:text-carbon-700 dark:placeholder:text-carbon-400 text-sm md:text-base", get(errors, 'subject') && 'border-red-600')}
          register={register}
          errors={errors}
          errorClassName='text-red-600 text-sm'
        />
      </span>

      <span className='w-full'>
        {label.email && <label htmlFor="Message">{label.message}</label>}
        <FormTextArea
          name='message'
          label='Message'
          placeholder={placeholder?.message}
          className={clsxm("rounded-2xl w-full mt-1 py-2 px-3 border-2 border-carbon-700 dark:bg-carbon-900 placeholder:text-carbon-700 dark:placeholder:text-carbon-400 text-sm md:text-base", get(errors, 'message') && 'border-red-600')}
          register={register}
          errors={errors}
          errorClassName='text-red-600 text-sm'
          rows={5}
        />
      </span>

      <Button
        type='submit'
        variant='primary'
        className='py-2 px-3 justify-center text-sm: md:text-base w-fit'
      >{submitText}</Button>
    </form>
  );
};

export default ContactForm;
