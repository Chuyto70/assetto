'use client';

import { format, parseISO } from 'date-fns';
import React, { useState } from 'react'

import { MediaUrl } from '@/lib/helper';
import { Article } from '@/lib/interfaces';

import Button from '@/components/elements/buttons/Button';
import ButtonLink from '@/components/elements/links/ButtonLink';
import NextImage from '@/components/NextImage';
import Skeleton from '@/components/Skeleton';

import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

import { loadMoreArticle } from '@/actions/strapi/load-more-articles';

const ArticlesList = ({ articles, pageSize = 3, pageCount = 1, page = 1, loadMoreText = 'load more', linkText = 'read the info' }: { articles: Article[]; pageSize?: number; pageCount?: number; page?: number; loadMoreText?: string; linkText?: string }) => {
  const locale = useServer((state) => state.locale);
  const notify = useToaster((state) => state.notify);
  const translations = useServer.getState().translations;
  const [currentPage, setCurrentPage] = useState(page);
  const [listArticles, setListArticles] = useState<Article[]>(articles);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    if (currentPage >= pageCount) return;
    setIsLoading(true);
    loadMoreArticle(locale, currentPage + 1, pageSize)
      .then((res) => {
        setCurrentPage((state) => state + 1)
        setListArticles((state) => [...state, ...res.data]);
      })
      .catch(() => {
        notify(
          1,
          <p>
            {translations.forms.request_error}
          </p>
        );
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <div className='flex flex-col items-center gap-6 md:gap-12'>
      <ul className='w-full grid auto-rows-fr gap-6 md:gap-12'>
        {listArticles.map((el) => (
          <li key={el.id} className='w-full h-full'>
            <article className='grid grid-cols-1 xs:grid-cols-5 gap-3 md:gap-6 w-full h-full' >
              <NextImage
                className='w-full h-fit xs:h-full xs:col-span-2 lg:col-span-1'
                imgClassName='w-full h-full object-cover object-center rounded-lg'
                useSkeleton
                width={el.attributes.thumbnail.data.attributes.width}
                height={el.attributes.thumbnail.data.attributes.height}
                src={MediaUrl(el.attributes.thumbnail.data.attributes.url)}
                alt={el.attributes.thumbnail.data.attributes.alternativeText ?? ''}
              />
              <div className='xs:col-span-3 lg:col-span-4 flex flex-col items-center xs:items-start gap-3 md:gap-6'>
                <div className='w-full flex gap-1 text-carbon-700 dark:text-carbon-400 font-semibold'>
                  <address rel="author">{el.attributes.author}</address>
                  <span>-</span>
                  <time dateTime={el.attributes.publishedAt}>{format(parseISO(el.attributes.publishedAt ?? '1970-01-01'), 'dd/MM/yyyy')}</time>
                </div>
                <h3 className='w-full'>{el.attributes.title}</h3>
                <p className='w-full line-clamp-3'>{el.attributes.short_description}</p>
                <ButtonLink href={`/${locale}/article/${el.attributes.slug}`}
                  scroll={false}
                  variant='dark'
                  className='w-fit'
                  icon='material-symbols:chevron-right-rounded'
                  iconClassName='w-6 h-6 md:w-8 md:h-8'
                >{linkText}</ButtonLink>
              </div>
            </article>
          </li>
        ))}

        {/* Loading skeletton */}
        {isLoading && (
          <>
            {Array.from({ length: pageSize }).map((_, index) => (
              <li key={`skeleton-${index}`} className='hidden xs:block'>
                <article className='grid grid-cols-1 xs:grid-cols-5 gap-3 md:gap-6 w-full h-full'>
                  <Skeleton className='w-full h-full xs:col-span-2 lg:col-span-1 rounded-lg' />
                  <div className='xs:col-span-3 lg:col-span-4 flex flex-col items-center xs:items-start gap-3 md:gap-6'>
                    <Skeleton className='max-w-full w-44 h-4 rounded-full' />
                    <Skeleton className='max-w-full w-64 h-6 rounded-full' />
                    <div className='w-full flex flex-col gap-2'>
                      <Skeleton className='w-full h-4 rounded-full' />
                      <Skeleton className='w-4/5 h-4 rounded-full' />
                      <Skeleton className='w-3/5 h-4 rounded-full' />
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </>
        )}
      </ul>
      {pageCount > 1 && <Button disabled={currentPage >= pageCount} isLoading={isLoading} onClick={handleLoadMore}
        variant='dark'
        className='w-fit text-lg md:text-xl px-6 font-semibold'
      >{loadMoreText}</Button>}
    </div>

  )
}

export default ArticlesList;