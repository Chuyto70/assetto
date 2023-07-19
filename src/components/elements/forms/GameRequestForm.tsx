'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { InferType, object, string } from 'yup';

import clsxm from '@/lib/clsxm';

import Button from '@/components/elements/buttons/Button';
import FormInput from '@/components/elements/forms/molecules/FormInput';

import { useToaster } from '@/store/toasterStore';

import { requestGame } from '@/actions/strapi/game-request';


const schema = object({
  email: string()
    .email("!Votre adresse email n'est pas valide")
    .required('!Une email est requise'),
  game: string().required("!Un jeu est requis")
}).required();

export type GameRequestFormType = InferType<typeof schema>;

const GameRequestForm = ({
  placeholder,
  submitText,
  className,
}: {
  placeholder?: {
    email: string;
    game: string;
  };
  submitText?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
}) => {
  const notify = useToaster((state) => state.notify);

  const { formState: { errors }, handleSubmit, register } = useForm<GameRequestFormType>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: true,
  });

  const submitSignUp = (data: GameRequestFormType) => {
    requestGame(data)
      .then(() =>
        notify(
          0,
          <p>
            !Votre demande a été prise en compte, merci
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
        name='game'
        label='Game'
        placeholder={placeholder?.game}
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

export default GameRequestForm;
