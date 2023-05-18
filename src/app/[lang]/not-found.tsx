import { RiAlarmWarningFill } from 'react-icons/ri';

import ArrowLink from '@/components/elements/links/ArrowLink';

import { useServer } from '@/store/serverStore';

export default function NotFound({
  lang,
  slug,
}: {
  slug: string[];
  lang: string;
}) {
  const translations = useServer.getState().translations;

  return (
    <>
      <main>
        <section className='bg-white'>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
            <RiAlarmWarningFill
              size={60}
              className='drop-shadow-glow animate-flicker text-red-500'
            />
            <h1 className='mt-8 text-4xl md:text-6xl'>
              {translations.page_not_found} - {slug}
            </h1>
            {lang && (
              <ArrowLink className='mt-4 md:text-lg' href={`/${lang ?? ''}`}>
                {translations.back_to_home_btn}
              </ArrowLink>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
