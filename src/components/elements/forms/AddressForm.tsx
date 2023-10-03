'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import Switch from '@/components/elements/buttons/Switch';
import FormErrorMessage from '@/components/elements/forms/atoms/FormErrorMessage';
import FormInput from '@/components/elements/forms/molecules/FormInput';

import { useServer } from '@/store/serverStore';

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

const translations = useServer.getState().translations;

const schema = yup
  .object({
    shippingDifferent: yup.boolean().required(),
    email: yup
      .string()
      .email(translations.forms.invalid_email)
      .required(translations.forms.required_email),
    address: yup
      .object({
        name: yup
          .string()
          .required(translations.forms.required_name)
          .min(2, translations.forms.min_name)
          .max(50, translations.forms.max_name)
          .matches(
            /^[A-Za-zÀ-ÿ-]+(?:\s[A-Za-zÀ-ÿ-]+)?$/i,
            translations.forms.regex_name
          ),

        city: yup
          .string()
          .required(translations.forms.required_city)
          .max(100, translations.forms.max_city)
          .matches(
            /^[a-zA-ZÀ-ÿ\s\-']+$/i,
            translations.forms.regex_city
          ),

        country: yup.string().required(translations.forms.required_country),

        line1: yup
          .string()
          .required(translations.forms.required_address)
          .matches(
            /^[0-9A-Za-zÀ-ÿ\s\-',.]+$/i,
            translations.forms.regex_address
          ),

        line2: yup
          .string()
          .notRequired()
          .matches(/^[0-9A-Za-zÀ-ÿ\s\-',.]+$/i, {
            excludeEmptyString: true,
            message:
              translations.forms.regex_address,
          }),

        postal_code: yup
          .string()
          .required(translations.forms.required_postalcode)
          .max(10, translations.forms.max_postalcode)
          .matches(
            /^[0-9A-Za-zÀ-ÿ\s\-'()]+$/i,
            translations.forms.regex_postalcode
          ),

        state: yup.string().notRequired(),
      })
      .required(),

    shipping: yup
      .object({
        name: yup
          .string()
          .required(translations.forms.required_name)
          .min(2, translations.forms.min_name)
          .max(50, translations.forms.max_name)
          .matches(
            /^[A-Za-zÀ-ÿ-]+(?:\s[A-Za-zÀ-ÿ-]+)?$/i,
            translations.forms.regex_name
          )
          .notRequired(),

        city: yup
          .string()
          .required(translations.forms.required_city)
          .max(100, translations.forms.max_city)
          .matches(
            /^[a-zA-ZÀ-ÿ\s\-']+$/i,
            translations.forms.regex_city
          )
          .notRequired(),

        country: yup.string().required(translations.forms.required_country).notRequired(),

        line1: yup
          .string()
          .required(translations.forms.required_address)
          .matches(
            /^[0-9A-Za-zÀ-ÿ\s\-',.]+$/i,
            translations.forms.regex_address
          )
          .notRequired(),

        line2: yup
          .string()
          .notRequired()
          .matches(/^[0-9A-Za-zÀ-ÿ\s\-',.]+$/i, {
            excludeEmptyString: true,
            message:
              translations.forms.regex_address,
          }),

        postal_code: yup
          .string()
          .required(translations.forms.required_postalcode)
          .max(10, translations.forms.max_postalcode)
          .matches(
            /^[0-9A-Za-zÀ-ÿ\s\-'()]+$/i,
            translations.forms.regex_postalcode
          )
          .notRequired(),

        state: yup.string().notRequired(),
      })
      .when('shippingDifferent', {
        is: false,
        then(schema) {
          return schema.nullable();
        },
      }),
  })
  .required();
export type AddressFormType = yup.InferType<typeof schema>;

const AddressForm = ({
  onSubmit,
}: {
  onSubmit: (data: AddressFormType) => void;
}) => {

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<AddressFormType>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    shouldUnregister: true,
  });

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

        <FormInput<AddressFormType>
          name='email'
          placeholder='!example@proton.me'
          label='Email'
          className='mb-2 border-2'
          errorClassName='mb-2 text-red-600'
          register={register}
          errors={errors}
        />

        <FormInput<AddressFormType>
          name='address.name'
          placeholder='!Jean Pierre'
          label='Full name'
          className='mb-2 border-2'
          errorClassName='mb-2 text-red-600'
          register={register}
          errors={errors}
        />

        <FormInput<AddressFormType>
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

        <FormInput<AddressFormType>
          name='address.line1'
          placeholder='!1 rue de la paix'
          label='line 1'
          className='mb-2 border-2'
          errorClassName='mb-2 text-red-600'
          register={register}
          errors={errors}
        />

        <FormInput<AddressFormType>
          name='address.line2'
          label='line 2'
          className='mb-2 border-2'
          errorClassName='mb-2 text-red-600'
          register={register}
          errors={errors}
        />

        <FormInput<AddressFormType>
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
            <FormInput<AddressFormType>
              name='shipping.name'
              placeholder='!Jean Pierre'
              label='Full name'
              className='mb-2 border-2'
              errorClassName='mb-2 text-red-600'
              register={register}
              errors={errors}
            />

            <FormInput<AddressFormType>
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

            <FormInput<AddressFormType>
              name='shipping.line1'
              placeholder='!1 rue de la paix'
              label='line 1'
              className='mb-2 border-2'
              errorClassName='mb-2 text-red-600'
              register={register}
              errors={errors}
            />

            <FormInput<AddressFormType>
              name='shipping.line2'
              label='line 2'
              className='mb-2 border-2'
              errorClassName='mb-2 text-red-600'
              register={register}
              errors={errors}
            />

            <FormInput<AddressFormType>
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

        <input type='submit' value={translations.btn.submit} />
      </form>
    </>
  );
};

export default AddressForm;
