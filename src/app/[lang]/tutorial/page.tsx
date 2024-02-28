/* eslint-disable @next/next/no-img-element */
'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

import { includeLocaleLink, MediaUrl } from "@/lib/helper";
import { Article } from "@/lib/interfaces";

import Button from "@/components/elements/buttons/Button";
import NextImage from "@/components/NextImage";
import Skeleton from "@/components/Skeleton";

import { useServer } from "@/store/serverStore";
import { useToaster } from "@/store/toasterStore";

import { loadMoreTutorials } from "@/actions/strapi/load-more-articles";


export default function Page() {
  const [loading, setLoading] = useState<boolean>(true)
  const [listArticles, setListArticles] = useState<Article[]>([]);
  const [pageCount, setPageCount] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState(1);
  const notify = useToaster((state) => state.notify);
  const translations = useServer.getState().translations;

  const handleLoadMore = () => {
    setLoading(true);
    loadMoreTutorials(currentPage, 3)
      .then((res) => {
        console.log(res)
        setPageCount(res.tutorials.meta.pagination.pageCount)
        setCurrentPage((state) => state + 1)
        setListArticles((state) => [...state, ...res.tutorials.data]);
      })
      .catch(() => {
        notify(
          1,
          <p>
            {translations.errors?.internal_server_error ?? 'Looks like something went wrong, please try again later'}
          </p>
        );
      })
      .finally(() => {
        setLoading(false)
      });
  }

  useEffect(() => {
    handleLoadMore()
  }, [])
   return (
    <div className='flex flex-col items-center gap-6 md:gap-12 w-full max-w-screen-xl px-3 md:px-6 lg:px-12'>
      <h2 className="italic">Look out our tutorials</h2>
      <ul className='w-full flex flex-wrap justify-center gap-6'>
        {listArticles?.map((el) => (
          <li key={el.id} className='w-auto max-w-[18rem] min-w-[18rem] md:h-64 xl:h-96 h-48'>
            <Link href={includeLocaleLink(`/${el.attributes.slug}`)} className="group relative flex h-48 flex-col overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-64 xl:h-96">
       
              <NextImage
                className='absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110'
                imgClassName='w-full h-full object-cover object-center rounded-lg'
                useSkeleton
                width={el.attributes.thumbnail.data.attributes.width}
                height={el.attributes.thumbnail.data.attributes.height}
                src={MediaUrl(el.attributes.thumbnail.data.attributes.url)}
                alt={el.attributes.thumbnail.data.attributes.alternativeText ?? ''}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>

              <div className="relative mt-auto p-4">
                {/* <span className="block text-sm text-gray-200">
                  <time dateTime={el.attributes.publishedAt}>{format(parseISO(el.attributes.publishedAt ?? '1970-01-01'), 'dd/MM/yyyy')}</time>
                  </span> */}
                <h2 className="mb-2 text-xl font-semibold text-white transition duration-100">{el.attributes.title}</h2>

                <span className="font-semibold text-indigo-300">Read more</span>
              </div>
            </Link>
            {/* <article className='grid grid-cols-1 xs:grid-cols-5 gap-3 md:gap-6 w-full h-full' >
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
                <ButtonLink title={el.attributes.title} href={includeLocaleLink(`/${el.attributes.slug}`)}
                  scroll={false}
                  variant='dark'
                  className='w-fit'
                  icon='material-symbols:chevron-right-rounded'
                  iconClassName='w-6 h-6 md:w-8 md:h-8'
                >Read more</ButtonLink>
              </div>
            </article> */}
          </li>
        ))}

        {/* Loading skeletton flex-wrap justify-center gap-6 */}
        {loading && (
          <div className="w-full flex flex-wrap justify-center gap-6"> 
            {Array.from({ length: 3 }).map((_, index) => (
              <li key={`skeleton-${index}`} className='hidden xs:block w-auto max-w-[18rem] min-w-[18rem] md:h-64 xl:h-96 h-48'>
                <article className='grid grid-cols-1 xs:grid-cols-5 gap-3 md:gap-6 w-full h-full'>
                  {/* <Skeleton className='w-full h-full xs:col-span-2 lg:col-span-1 rounded-lg' /> */}
                  <Skeleton className='max-w-[18rem] min-w-[18rem] h-44 rounded-lg md:h-64 xl:h-96' />
                  {/* <div className='xs:col-span-3 lg:col-span-4 flex flex-col items-center xs:items-start gap-3 md:gap-6'>
                    <Skeleton className='max-w-full w-44 h-4 rounded-full' />
                   
                  </div> */}
                </article>
              </li>
            ))}
          </div>
        )}
      </ul>
      {pageCount >= 1 && <Button disabled={currentPage >= pageCount} isLoading={loading} onClick={handleLoadMore}
        variant='dark'
        className='w-fit text-lg md:text-xl px-6 font-semibold'
      >Load more</Button>}
    </div>

  )
}
