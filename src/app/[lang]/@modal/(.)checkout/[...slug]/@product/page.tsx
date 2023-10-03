import Link from 'next/link';
import React from 'react'

import { QueryProductFromSlug, QuerySettings } from '@/lib/graphql';

import PaypalBtn from '@/components/elements/buttons/PaypalBtn';
import PreviousLink from '@/components/elements/links/PreviousLink';
import Modal from '@/components/elements/modal/Modal';
import FormatPrice from '@/components/elements/texts/FormatPrice';
import PriceDetails from '@/components/elements/texts/PriceDetails';
import NextImage from '@/components/NextImage';

import { useServer } from '@/store/serverStore';

async function CheckoutModal({
  params: { slug, lang },
}: {
  params: { slug: string[]; lang: string };
}) {

  const translations = useServer.getState().translations;

  const { paypal_client_id } = await QuerySettings(lang);
  const { data } = await QueryProductFromSlug(lang, slug);
  const product = data[0];

  return (
    <Modal dismissBack={true}>
      <div
        className="text-carbon-900 dark:text-white bg-carbon-200 dark:bg-carbon-900 shadow-xl dark:shadow-carbon-500/10 dark:border-2 rounded-3xl p-3 md:p-6 overflow-hidden flex flex-col gap-3 md:gap-6 divide-y-2 divide-carbon-300 dark:divide-carbon-800"
      >
        <h3 className='flex gap-3 items-center'>
          <NextImage src="/images/card-dynamic-color.png" quality={100} width={30} height={30} alt="3d icon of a credit card"
            className='inline-block'
          />
          {translations.checkout.subscribe_to} {product.attributes.title}</h3>

        <div className='pt-3 md:pt-6 flex flex-col md:flex-row gap-3'>
          <div className='w-full md:w-1/2'>
            {paypal_client_id && <PaypalBtn intentType='subscription'
              clientId={paypal_client_id}
              prices={product.attributes.prices}
              successPageSlug={product.attributes.success_page?.data.attributes.slug ?? '/'}
            />}
          </div>

          <div className='w-full md:w-1/2 flex flex-col gap-3 rounded-2xl border-2 border-carbon-300 dark:border-carbon-800 p-3 md:p-6'>
            <div className='flex items-center w-full justify-between text-lg md:text-xl'>
              <p className='text-carbon-700 dark:text-carbon-400'>{translations.checkout.total_amount}</p>
              <p className='font-medium'><FormatPrice text={translations.checkout.format_price} prices={product.attributes.prices} /></p>
            </div>
            <hr className='border-t-2 border-carbon-300 dark:border-carbon-800' />
            <PriceDetails
              className='flex items-center w-full justify-between'
              lineClassName='text-carbon-700 dark:text-carbon-400'
              amountClassName='font-medium'
              prices={product.attributes.prices} />
          </div>
        </div>

        <div className='pt-3 md:pt-6 flex justify-between'>
          <PreviousLink className='text-carbon-700 dark:text-carbon-400 cursor-pointer' dismissBack={true}>{translations.btn.previous}</PreviousLink>
          <Link href={`/checkout/${product.attributes.success_page?.data.attributes.slug}`}>test</Link>
        </div>
      </div>
    </Modal >
  )
}

export default CheckoutModal;