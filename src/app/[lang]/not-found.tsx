import Image from 'next/image';

import ButtonLink from '@/components/elements/links/ButtonLink';

import { useServer } from '@/store/serverStore';

export default function NotFound({
  lang,
  slug,
}: {
  slug?: string[];
  lang: string;
}) {
  const translations = useServer.getState().translations;

  return (
    <div className='w-full max-w-screen-md px-3 md:px-6 lg:px-12 flex flex-1 flex-col items-center justify-center text-center text-black'>
      <h1 className='uppercase italic mt-8 text-4xl md:text-6xl text-carbon-900 dark:text-white'>
        {translations.errors?.page_not_found}{slug && ` | ${slug}`}
      </h1>
      {lang && (
        <ButtonLink
          variant='dark'
          rightIcon='octicon:chevron-right-12'
          rightIconClassName='w-4 h-4 md:w-6 md:h-6'
          size='xl'
          className='mt-4 text-lg md:text-xl font-semibold' href={`/${lang ?? ''}`}
        >
          {translations.btn?.back_to_home}
        </ButtonLink>
      )}
      <Image src='/images/lost.svg'
        alt={translations.errors?.page_not_found}
        width={1000}
        height={1000}
        className='w-full h-full object-contain object-center'
      />
    </div>
  );
}
