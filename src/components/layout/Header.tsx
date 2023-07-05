import Image from 'next/image';
import * as React from 'react';

import { QueryMenus } from '@/lib/graphql';
import { MediaUrl } from '@/lib/helper';

import DynamicIcon from '@/components/elements/DynamicIcon';
import Link from '@/components/elements/links';
import UnstyledLink from '@/components/elements/links/UnstyledLink';
import HeaderBurger from '@/components/layout/HeaderBurger';
import HeaderItem from '@/components/layout/HeaderItem';

import { useServer } from '@/store/serverStore';

export default async function Header() {
  const locale = useServer.getState().locale;
  const translations = useServer.getState().translations;
  const { data } = await QueryMenus(locale);
  const { header } = data.attributes;

  return (
    <header className='sticky top-0 z-50 bg-secondary-100 text-carbon-900 font-bold'>
      <div className='max-w-screen-3xl grid grid-flow-row grid-cols-[auto_1fr_auto] items-center gap-3 p-3 lg:gap-6 md:px-6 lg:px-12 md:py-6 text-lg xl:text-xl'>
        <HeaderBurger items={header.items} className='md:hidden' />

        <UnstyledLink
          href={header.logo_link}
          className='flex justify-center md:order-first'
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

        {/* Desktop links */}
        <ul className='hidden md:flex justify-center gap-3 lg:gap-6'>
          {header.items.map((item) => (
            <HeaderItem
              key={item.id}
              name={item.link.name}
              sublinks={item.sublinks}
            >
              <Link
                href={item.link.href}
                style={item.link.style}
                icon={item.link.icon}
                openNewTab={item.link.open_new_tab}
                variant={item.link.variant}
              >
                {item.link.name}
              </Link>
            </HeaderItem>
          ))}
        </ul>

        <UnstyledLink
          href={`/${locale}/${header.cart_page?.data.attributes.slug}`}
          className='flex flex-row items-center gap-3 lg:gap-6 flex-nowrap'
        >
          <p className='hidden md:block'>{translations.cart.title}</p>
          <DynamicIcon
            icon='heroicons:shopping-bag'
            className='w-8 h-8 lg:w-10 lg:h-10 text-carbon-900 grow-0'
            skeletonClassName='w-8 h-8 lg:w-10 lg:h-10'
          />
        </UnstyledLink>
      </div>
    </header>
  );
}
