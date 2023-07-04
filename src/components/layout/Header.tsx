import Image from 'next/image';
import * as React from 'react';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

import { QueryMenus } from '@/lib/graphql';
import { MediaUrl } from '@/lib/helper';

import UnstyledLink from '@/components/elements/links/UnstyledLink';
import HeaderBurger from '@/components/layout/HeaderBurger';

import { useServer } from '@/store/serverStore';

export default async function Header() {
  const locale = useServer.getState().locale;
  const { data } = await QueryMenus(locale);
  const { header } = data.attributes;

  return (
    <header className='sticky top-0 z-50 bg-secondary-100 text-carbon-900'>
      <div className='grid grid-flow-row grid-cols-[auto_1fr_auto] items-center gap-3 p-3 '>
        <HeaderBurger items={header.items} />

        <UnstyledLink
          href={`/${locale}/${header.logo_link}`}
          className='flex justify-center lg:order-first'
        >
          <Image
            src={MediaUrl(header.logo.data.attributes.url)}
            priority
            quality={100}
            width={header.logo.data.attributes.width}
            height={header.logo.data.attributes.height}
            alt={header.logo.data.attributes.alternativeText ?? ''}
            className='object-contain object-center w-full h-10'
            sizes='80vw'
          />
        </UnstyledLink>

        <UnstyledLink
          href={`/${locale}/${header.cart_page?.data.attributes.slug}`}
        >
          <HiOutlineShoppingBag className='h-8 w-8 text-carbon-900 grow-0' />
        </UnstyledLink>
      </div>
    </header>
  );
}
