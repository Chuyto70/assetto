import Image from 'next/image';
import * as React from 'react';

import { QueryMenus } from '@/lib/graphql';
import { MediaUrl } from '@/lib/helper';

import ThemeSwitch from '@/components/elements/buttons/ThemeSwitch';
import DynamicIcon from '@/components/elements/DynamicIcon';
import Link from '@/components/elements/links';
import UnstyledLink from '@/components/elements/links/UnstyledLink';
import HeaderBurger from '@/components/layout/HeaderBurger';
import HeaderItem from '@/components/layout/HeaderItem';
import SettingsButton from '@/components/layout/SettingsButton';

import { useServer } from '@/store/serverStore';

export default async function Header() {
  const locale = useServer.getState().locale;
  const { data } = await QueryMenus(locale);
  const { header } = data.attributes;

  return (
    <header className='sticky top-0 z-40 bg-carbon-200 dark:bg-carbon-900 border-b-2 border-carbon-900 dark:border-0 text-carbon-900  dark:text-white font-bold'>
      <div className='layout w-full flex flex-row items-center justify-between gap-3 p-3 lg:px-12 lg:gap-6 text-base md:text-sm xl:text-base'>
        <UnstyledLink
          href={header.logo_link}
          className='flex shrink-1'
          aria-label='home page'
        >
          <Image
            src={MediaUrl(header.logo.data.attributes.url)}
            priority
            quality={100}
            width={header.logo.data.attributes.width}
            height={header.logo.data.attributes.height}
            alt={header.logo.data.attributes.alternativeText ?? ''}
            className='object-contain object-left w-full h-10'
            sizes='50vw'
          />
        </UnstyledLink>

        <HeaderBurger
          items={header.items}
          className='md:hidden flex justify-center'
        />

        {/* Desktop links */}
        <ul className='hidden md:flex shrink-1 gap-3 lg:gap-6'>
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
                className='font-bold dark:font-bold'
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

        <div className='hidden md:flex shrink-0 lg:gap-3'>
          {/* This will be the theme and lang/currency buttons */}
          <div className='h-10 w-20 flex items-center'><ThemeSwitch className='h-full' /></div>
          <SettingsButton className='h-10 rounded-full flex items-center p-1 px-2 gap-1 bg-carbon-200 dark:bg-carbon-900 shadow-carbon-200-inner dark:shadow-carbon-900-inner'>
            <Image src="/images/setting-dynamic-color.png" quality={100} width={30} height={30} alt="3d settings icon" />
          </SettingsButton>
        </div>
      </div>
    </header>
  );
}
