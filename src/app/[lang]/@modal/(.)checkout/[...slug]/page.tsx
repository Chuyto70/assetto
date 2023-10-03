import React from 'react'

import { QueryPageFromSlug } from '@/lib/graphql';

import ButtonLink from '@/components/elements/links/ButtonLink';
import ModalWrapper from '@/components/layout/ModalWrapper';
import NextImage from '@/components/NextImage';
import Sections, { sectionTypeProps } from '@/components/sections';

import { useServer } from '@/store/serverStore';

async function CheckoutCompleteModal({
  params: { slug, lang },
}: {
  params: { slug: string[]; lang: string };
}) {
  const { data } = await QueryPageFromSlug(lang, slug);
  if (data.length <= 0) return null;

  const translations = useServer.getState().translations;

  const pageID = data[0].id;
  const { content } = data[0].attributes;


  return (
    <ModalWrapper routerRoute='/' className='max-w-fit'>
      <div
        className="text-carbon-900 dark:text-white bg-carbon-200 dark:bg-carbon-900 shadow-xl dark:shadow-carbon-500/10 dark:border-2 rounded-3xl p-3 md:p-6 overflow-hidden flex flex-col gap-3 md:gap-6 divide-y-2 divide-carbon-300 dark:divide-carbon-800 w-fit"
      >
        <h3 className='flex gap-3 items-center'>
          <NextImage src="/images/tick-dynamic-color.png" quality={100} width={30} height={30} alt="3d icon of a credit card"
            className='inline-block'
          />
          {translations.checkout.subscribed}</h3>

        <div className='pt-3 md:pt-6 flex flex-col gap-3 md:gap-6 w-fit'>
          <Sections sections={content as [sectionTypeProps]} pageID={pageID} />
        </div>

        <div className='pt-3 md:pt-6 flex justify-center'>
          <ButtonLink href="/" nextLinkProps={{ replace: true }}>{translations.btn.back_to_home}</ButtonLink>
        </div>
      </div>
    </ModalWrapper>
  );
}

export default CheckoutCompleteModal;