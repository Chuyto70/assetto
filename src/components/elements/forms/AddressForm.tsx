'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { FormEvent } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup
  .object({
    name: yup
      .string()
      .required('!Un nom est requis')
      .min(2, '!Votre nom doit comporter plus de 2 lettres')
      .max(50, '!Votre nom est trop long')
      .matches(
        /^[A-Za-zÀ-ÿ-]+(?:\s[A-Za-zÀ-ÿ-]+)?$/i,
        "!Votre nom doit être composé de lettres et d'un éventuel espace"
      ),

    city: yup
      .string()
      .required('!Une ville est requise')
      .max(100, '!Votre ville est trop longue')
      .matches(
        /^[a-zA-ZÀ-ÿ\s\-']+$/i,
        "!Votre ville doit être composée de lettres, d'espaces, de tirets ou d'apostrophes"
      ),

    country: yup
      .string()
      .required('!Un pays est requis')
      .max(100)
      .matches(
        /^[a-zA-ZÀ-ÿ\s\-'()]+$/i,
        "!Votre pays doit être composé de lettres, d'espaces, de tirets, d'apostrophes ou de parenthèses"
      ),

    line1: yup
      .string()
      .required('!Une addresse est requise')
      .matches(
        /^[0-9A-Za-zÀ-ÿ\s\-',.]+$/i,
        "!Votre adresse doit être composée de chiffres, de lettres, d'espaces, de tirets, d'apostrophes ou de points"
      ),

    line2: yup
      .string()
      .notRequired()
      .matches(/^[0-9A-Za-zÀ-ÿ\s\-',.]+$/i, {
        excludeEmptyString: true,
        message:
          "!Votre adresse doit être composée de chiffres, de lettres, d'espaces, de tirets, d'apostrophes ou de points",
      }),

    postalCode: yup
      .string()
      .required('!Un code postal est requis')
      .max(10, '!Votre code postal est trop long')
      .matches(
        /^[0-9A-Za-zÀ-ÿ\s\-'()]+$/i,
        "!Votre code postal doit être composé de chiffres, de lettres, d'espaces, de tirets, d'apostrophes ou de parenthèses"
      ),

    state: yup
      .string()
      .notRequired()
      .matches(/^[a-zA-ZÀ-ÿ\s\-'()]+$/i, {
        excludeEmptyString: true,
        message:
          "!Votre état ou région doit être composé de lettres, d'espaces, de tirets, d'apostrophes ou de parenthèses",
      }),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

const AddressForm = () => {
  const {
    control,
    register,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  const onSubmit = (e: FormEvent<HTMLFormElement>) => e.preventDefault();

  return (
    <form onSubmit={onSubmit}>
      <input
        className='border-2'
        placeholder='!Full name'
        {...register('name')}
      />
      <p>{errors.name?.message}</p>

      <input className='border-2' placeholder='!City' {...register('city')} />
      <p>{errors.city?.message}</p>

      <Controller
        name='country'
        render={({ field: { name, onChange, value } }) => (
          <CountryDropdown
            defaultOptionLabel='!-- Select Country --'
            name={name}
            value={value}
            onChange={onChange}
          />
        )}
        control={control}
      />
      <p>{errors.country?.message}</p>

      <input className='border-2' placeholder='!Line1' {...register('line1')} />
      <p>{errors.line1?.message}</p>

      <input className='border-2' placeholder='!Line2' {...register('line2')} />
      <p>{errors.line2?.message}</p>

      <input
        className='border-2'
        placeholder='!Postal code'
        {...register('postalCode')}
      />
      <p>{errors.postalCode?.message}</p>

      {watch().country && (
        <>
          <Controller
            name='state'
            render={({ field: { name, onChange, value } }) => (
              <RegionDropdown
                country={watch().country}
                defaultOptionLabel='!-- Select Region --'
                name={name}
                value={value ?? ''}
                onChange={onChange}
              />
            )}
            control={control}
          />
          <p>{errors.state?.message}</p>
        </>
      )}
    </form>
  );
};

export default AddressForm;

// Je veux changer ce composant pour faire des composant par field afin de controller plus spécifiquement quels fields sont dans mon form, le checkout sera le form et je choisi quels fields sont dedans
