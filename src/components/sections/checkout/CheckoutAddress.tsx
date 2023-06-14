'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import logger from '@/lib/logger';

import Switch from '@/components/elements/buttons/Switch';
import FormErrorMessage from '@/components/elements/forms/atoms/FormErrorMessage';
import FormInput from '@/components/elements/forms/molecules/FormInput';

import { useCart } from '@/store/cartStore';
import { useToaster } from '@/store/toasterStore';

import { stripe_add_address_strapi_order } from '@/actions/stripeCheckoutActions';

const CountryDropdown = dynamic(
  () =>
    import('react-country-region-selector').then((mod) => mod.CountryDropdown),
  { ssr: false }
);
const RegionDropdown = dynamic(
  () =>
    import('react-country-region-selector').then((mod) => mod.RegionDropdown),
  { ssr: false }
);

const schema = yup
  .object({
    shippingDifferent: yup.boolean(),
    email: yup
      .string()
      .email("!Votre adresse email n'est pas valide")
      .required('!Email requise'),
    address: yup
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

        country: yup.string().required('!Un pays est requis'),

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

        postal_code: yup
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
      .required(),

    shipping: yup
      .object({
        name: yup
          .string()
          .required('!Un nom est requis')
          .min(2, '!Votre nom doit comporter plus de 2 lettres')
          .max(50, '!Votre nom est trop long')
          .matches(
            /^[A-Za-zÀ-ÿ-]+(?:\s[A-Za-zÀ-ÿ-]+)?$/i,
            "!Votre nom doit être composé de lettres et d'un éventuel espace"
          )
          .notRequired(),

        city: yup
          .string()
          .required('!Une ville est requise')
          .max(100, '!Votre ville est trop longue')
          .matches(
            /^[a-zA-ZÀ-ÿ\s\-']+$/i,
            "!Votre ville doit être composée de lettres, d'espaces, de tirets ou d'apostrophes"
          )
          .notRequired(),

        country: yup.string().required('!Un pays est requis').notRequired(),

        line1: yup
          .string()
          .required('!Une addresse est requise')
          .matches(
            /^[0-9A-Za-zÀ-ÿ\s\-',.]+$/i,
            "!Votre adresse doit être composée de chiffres, de lettres, d'espaces, de tirets, d'apostrophes ou de points"
          )
          .notRequired(),

        line2: yup
          .string()
          .notRequired()
          .matches(/^[0-9A-Za-zÀ-ÿ\s\-',.]+$/i, {
            excludeEmptyString: true,
            message:
              "!Votre adresse doit être composée de chiffres, de lettres, d'espaces, de tirets, d'apostrophes ou de points",
          }),

        postal_code: yup
          .string()
          .required('!Un code postal est requis')
          .max(10, '!Votre code postal est trop long')
          .matches(
            /^[0-9A-Za-zÀ-ÿ\s\-'()]+$/i,
            "!Votre code postal doit être composé de chiffres, de lettres, d'espaces, de tirets, d'apostrophes ou de parenthèses"
          )
          .notRequired(),

        state: yup
          .string()
          .notRequired()
          .matches(/^[a-zA-ZÀ-ÿ\s\-'()]+$/i, {
            excludeEmptyString: true,
            message:
              "!Votre état ou région doit être composé de lettres, d'espaces, de tirets, d'apostrophes ou de parenthèses",
          }),
      })
      .when('shippingDifferent', {
        is: false,
        then(schema) {
          return schema.nullable();
        },
      }),
  })
  .required();
export type CheckoutAddressType = yup.InferType<typeof schema>;

const CheckoutAddress = () => {
  const stripeClientSecret = useCart((state) => state.stripeClientSecret);
  const stripePaymentIntentId = useCart((state) => state.stripePaymentIntentId);

  const notify = useToaster((state) => state.notify);

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<CheckoutAddressType>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: true,
  });

  const onSubmit = (data: CheckoutAddressType) => {
    if (stripeClientSecret && stripePaymentIntentId) {
      stripe_add_address_strapi_order(stripePaymentIntentId, data)
        .then(({ error, success }) => {
          if (!error && success) {
            logger(success);
          } else {
            notify(
              2,
              <p>!Une erreur s'est produite, vérifiez votre adresse</p>
            );
          }
        })
        .catch(() => {
          notify(2, <p>!Une erreur s'est produite</p>);
        });
    } else {
      return redirect('/'); //!push vers le panier
    }
  };

  if (!stripeClientSecret || !stripePaymentIntentId) {
    return redirect('/'); //!push vers le panier
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>!Addresse de livraison différente :</p>
          <Controller
            name='shippingDifferent'
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <Switch toggle={field.onChange} toggleIsOn={field.value} />
            )}
          />
        </div>

        <FormInput<CheckoutAddressType>
          name='email'
          placeholder='!example@proton.me'
          label='Email'
          className='mb-2 border-2'
          errorClassName='mb-2 text-red-600'
          register={register}
          errors={errors}
        />

        <FormInput<CheckoutAddressType>
          name='address.name'
          placeholder='!Jean Pierre'
          label='Full name'
          className='mb-2 border-2'
          errorClassName='mb-2 text-red-600'
          register={register}
          errors={errors}
        />

        <FormInput<CheckoutAddressType>
          name='address.city'
          placeholder='!Paris'
          label='City'
          className='mb-2 border-2'
          errorClassName='mb-2 text-red-600'
          register={register}
          errors={errors}
        />

        <Controller
          name='address.country'
          render={({ field }) => (
            <CountryDropdown
              defaultOptionLabel='!-- Select Country --'
              name={field.name}
              value={field.value}
              valueType='short'
              onChange={field.onChange}
            />
          )}
          control={control}
        />
        <FormErrorMessage>{errors.address?.country?.message}</FormErrorMessage>

        <FormInput<CheckoutAddressType>
          name='address.line1'
          placeholder='!1 rue de la paix'
          label='line 1'
          className='mb-2 border-2'
          errorClassName='mb-2 text-red-600'
          register={register}
          errors={errors}
        />

        <FormInput<CheckoutAddressType>
          name='address.line2'
          label='line 2'
          className='mb-2 border-2'
          errorClassName='mb-2 text-red-600'
          register={register}
          errors={errors}
        />

        <FormInput<CheckoutAddressType>
          name='address.postal_code'
          placeholder='!75000'
          label='Postal code'
          className='mb-2 border-2'
          errorClassName='mb-2 text-red-600'
          register={register}
          errors={errors}
        />

        {watch().address?.country && (
          <>
            <Controller
              name='address.state'
              render={({ field: { name, onChange, value } }) => (
                <RegionDropdown
                  country={watch().address.country}
                  countryValueType='short'
                  defaultOptionLabel='!-- Select Region --'
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                />
              )}
              control={control}
            />
            <FormErrorMessage>
              {errors.address?.state?.message}
            </FormErrorMessage>
          </>
        )}

        {watch('shippingDifferent') && (
          <>
            <FormInput<CheckoutAddressType>
              name='shipping.name'
              placeholder='!Jean Pierre'
              label='Full name'
              className='mb-2 border-2'
              errorClassName='mb-2 text-red-600'
              register={register}
              errors={errors}
            />

            <FormInput<CheckoutAddressType>
              name='shipping.city'
              placeholder='!Paris'
              label='City'
              className='mb-2 border-2'
              errorClassName='mb-2 text-red-600'
              register={register}
              errors={errors}
            />

            <Controller
              name='shipping.country'
              render={({ field }) => (
                <CountryDropdown
                  defaultOptionLabel='!-- Select Country --'
                  name={field.name}
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  value={field.value!}
                  valueType='short'
                  onChange={field.onChange}
                />
              )}
              control={control}
            />
            <FormErrorMessage>
              {errors.shipping?.country?.message}
            </FormErrorMessage>

            <FormInput<CheckoutAddressType>
              name='shipping.line1'
              placeholder='!1 rue de la paix'
              label='line 1'
              className='mb-2 border-2'
              errorClassName='mb-2 text-red-600'
              register={register}
              errors={errors}
            />

            <FormInput<CheckoutAddressType>
              name='shipping.line2'
              label='line 2'
              className='mb-2 border-2'
              errorClassName='mb-2 text-red-600'
              register={register}
              errors={errors}
            />

            <FormInput<CheckoutAddressType>
              name='shipping.postal_code'
              placeholder='!75000'
              label='Postal code'
              className='mb-2 border-2'
              errorClassName='mb-2 text-red-600'
              register={register}
              errors={errors}
            />

            {watch().shipping?.country && (
              <>
                <Controller
                  name='shipping.state'
                  render={({ field: { name, onChange, value } }) => (
                    <RegionDropdown
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      country={watch().shipping.country!}
                      countryValueType='short'
                      defaultOptionLabel='!-- Select Region --'
                      name={name}
                      value={value ?? ''}
                      onChange={onChange}
                    />
                  )}
                  control={control}
                />
                <FormErrorMessage>
                  {errors.shipping?.state?.message}
                </FormErrorMessage>
              </>
            )}
          </>
        )}

        <input type='submit' value='!Valider' />
      </form>
    </>
  );
};

export default CheckoutAddress;

// Lazy load le component country et region + il est chargé dans d'autres pages ?
