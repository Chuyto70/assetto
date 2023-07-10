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
  const { data } = await QueryMenus(locale);
  const { header } = data.attributes;

  return (
    <header className='sticky top-0 z-50 bg-white dark:bg-carbon-900 text-carbon-900 dark:text-white font-bold'>
      <div className='max-w-screen-3xl grid grid-flow-row grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto] items-center gap-3 p-3 md:p-6 lg:px-12 lg:gap-6 text-base'>
        <UnstyledLink
          href={header.logo_link}
          className='flex'
        >
          <Image
            src={MediaUrl(header.logo.data.attributes.url)}
            priority
            quality={100}
            width={header.logo.data.attributes.width}
            height={header.logo.data.attributes.height}
            alt={header.logo.data.attributes.alternativeText ?? ''}
            className='object-contain object-left w-full h-10'
            sizes='80vw'
          />
        </UnstyledLink>

        <HeaderBurger
          items={header.items}
          className='md:hidden flex justify-center'
        />

        {/* Desktop links */}
        <ul className='hidden md:flex flex-wrap gap-3 lg:gap-6'>
          {header.items.map((item) => (
            <HeaderItem
              key={item.id}
              sublinks={item.sublinks}
              className='flex flex-row items-center gap-1'
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
              {item.sublinks.length > 0 && <span className='w-8 h-8'><DynamicIcon
                icon='material-symbols:keyboard-arrow-down-rounded'
                className='h-full w-full text-carbon-900 dark:text-white'
              /></span>}
            </HeaderItem>
          ))}
        </ul>
      </div>
    </header>
  );
}
