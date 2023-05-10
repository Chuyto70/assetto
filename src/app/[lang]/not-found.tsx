import { RiAlarmWarningFill } from 'react-icons/ri';

import ArrowLink from '@/components/elements/links/ArrowLink';

export default function NotFound({
  lang,
  slug,
}: {
  slug: string[];
  lang: string;
}) {
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
              Page Not Found - {slug}
            </h1>
            {(lang && (
              <ArrowLink className='mt-4 md:text-lg' href={`/${lang}`}>
                Back to Home
              </ArrowLink>
            )) ?? (
              <ArrowLink className='mt-4 md:text-lg' href='/'>
                Back to Home
              </ArrowLink>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
