import DynamicIcon from '@/components/elements/DynamicIcon';
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
    <main className='flex flex-col flex-1'>
      <div className='layout flex flex-1 flex-col items-center justify-center text-center text-black'>
        <DynamicIcon
          icon='ri:alarm-warning-fill'
          className='w-32 h-32 md:w-60 md:h-60 drop-shadow-glow animate-flicker text-red-500'
          wrapperClassName='w-32 h-32 md:w-60 md:h-60 '
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
    </main>
  );
}
