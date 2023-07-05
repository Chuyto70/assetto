'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { InferType, object, string } from 'yup';

import clsxm from '@/lib/clsxm';

import IconButton from '@/components/elements/buttons/IconButton';
import FormInput from '@/components/elements/forms/molecules/FormInput';

import { useToaster } from '@/store/toasterStore';

import { addContact } from '@/actions/sendgrid/marketing';

const schema = object({
  email: string()
    .email("!Votre adresse email n'est pas valide")
    .required('!Une email est requise'),
}).required();

export type NewsletterFormType = InferType<typeof schema>;

const NewsletterForm = ({
  placeholder,
  className,
  inputClassName,
  buttonClassName,
}: {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}) => {
  const notify = useToaster((state) => state.notify);

  const { handleSubmit, register } = useForm<NewsletterFormType>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: true,
  });

  const submitSignUp = (data: NewsletterFormType) => {
    addContact(data.email)
      .then(() =>
        notify(
          0,
          <p>
            !Votre e-mail a été ajouté avec succès à la liste de diffusion.
            Bienvenue 👋
          </p>
        )
      )
      .catch(() =>
        notify(
          1,
          <p>
            !Oups, il y a eu un problème avec votre inscription, veuillez
            réessayer plus tard
          </p>
        )
      );
  };

  return (
    <form
      onSubmit={handleSubmit(submitSignUp)}
      className={clsxm(
        'flex flex-row justify-between text-carbon-900 bg-white rounded-full',
        className
      )}
    >
      <FormInput
        name='email'
        label='Email'
        placeholder={placeholder}
        className={clsxm('rounded-l-full border-0 shrink', inputClassName)}
        register={register}
      />
      <IconButton
        type='submit'
        icon='mi:chevron-right'
        variant='ghost'
        className={clsxm(
          'bg-primary-50 border-primary-200 text-carbon-900 text-2xl rounded-full h-full aspect-square shrink-0',
          buttonClassName
        )}
      />
    </form>
  );
};

export default NewsletterForm;
