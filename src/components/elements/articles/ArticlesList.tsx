'use client';

import { format, parseISO } from 'date-fns';
import React, { useState } from 'react'

import { MediaUrl } from '@/lib/helper';
import { Article } from '@/lib/interfaces';

import Button from '@/components/elements/buttons/Button';
import NextImage from '@/components/NextImage';
import Skeleton from '@/components/Skeleton';

import { useServer } from '@/store/serverStore';
import { useToaster } from '@/store/toasterStore';

import { loadMoreArticle } from '@/actions/strapi/load-more-articles';

const ArticlesList = ({ articles, pageSize = 3, pageCount = 1, page = 1, loadMoreText = 'load more' }: { articles: Article[]; pageSize?: number; pageCount?: number; page?: number; loadMoreText?: string }) => {
  const locale = useServer((state) => state.locale);
  const notify = useToaster((state) => state.notify);
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
            !Oups, il y a eu un problème avec votre inscription, veuillez
            réessayer plus tard
          </p>
        );
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <>
      <ul className='w-full flex flex-col gap-3 md:gap-6'>
        {listArticles.map((el) => (
          <li key={el.id} className='w-full'>
            <article className='flex flex-col gap-3 md:gap-6 w-full' >
              <NextImage
                className='w-full md:w-1/5 aspect-square'
                imgClassName='w-full h-full object-cover object-center rounded-lg'
                useSkeleton
                width={el.attributes.thumbnail.data.attributes.width}
                height={el.attributes.thumbnail.data.attributes.height}
                src={MediaUrl(el.attributes.thumbnail.data.attributes.url)}
                alt={el.attributes.thumbnail.data.attributes.alternativeText ?? ''}
              />
              <div className='md:w-4/5 flex flex-col gap-3 md:gap-6'>
                <span>
                  <address rel="author">{el.attributes.author}</address>
                  <time dateTime={el.attributes.publishedAt}>{format(parseISO(el.attributes.publishedAt ?? '1970-01-01'), 'dd/MM/yyyy')}</time>
                </span>
                <h3>{el.attributes.title}</h3>
              </div>
            </article>
          </li>
        ))}

        {/* Loading skeletton */}
        {isLoading && (
          <>
            {Array.from({ length: pageSize }).map((_, index) => (
              <li key={`skeleton-${index}`}>
                <Skeleton className='w-full' />
              </li>
            ))}
          </>
        )}
      </ul>
      {pageCount > 1 && <Button disabled={currentPage >= pageCount} isLoading={isLoading} onClick={handleLoadMore}
        variant='dark'
        className='text-lg font-semibold'
      >{loadMoreText}</Button>}
    </>

  )
}

export default ArticlesList;