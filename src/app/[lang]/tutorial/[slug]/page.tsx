/* eslint-disable @next/next/no-img-element */
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { cache, Suspense } from "react";

import { QueryByTagsTutorials, QueryOneTutorial } from "@/lib/graphql";
import { includeLocaleLink, MediaUrl } from "@/lib/helper";
import { Tutorial } from "@/lib/interfaces";

import { Buttonback } from "@/components/elements/buttons/Buttonback";
import RemoteMDX from "@/components/elements/texts/RemoteMDX";
import NextImage from "@/components/NextImage";

export const revalidate = 0

const fetchingRelatedTutorials = cache(async (tutorial: Tutorial[]) =>{
    const matches = tutorial[0].attributes.tags.match(/#\w+\b/g);
    let relatedTutorials: Tutorial[] = [];

    if (matches) {
        const relatedPromises = matches.map(async (tag) => {
            if (relatedTutorials.length <= 6) {
                try {
                    const tutorialRelated = await QueryByTagsTutorials('en', tag);
                    
                    const filtredTutorials = tutorialRelated.tutorials.data.filter(
                        (el) => el.id !== tutorial[0].id
                    );

                    const uniqueTutorials = new Set(filtredTutorials);
                    const uniqueTutorialsArray = [...uniqueTutorials];
                    relatedTutorials = [...relatedTutorials, ...uniqueTutorialsArray]
                } catch (error) {
                    console.error('Error fetching related tutorials:', error);
                }
            }
        });

        await Promise.all(relatedPromises);
    }
    const hash: any = {};
    relatedTutorials = relatedTutorials.filter(o => hash[o.id] ? false : hash[o.id] = true);

    return relatedTutorials.slice(0, 6);
})

export default async function Page({ params }: { params: { slug: string } }) {
  const { tutorials }: {tutorials: {data: Tutorial[]} } = await QueryOneTutorial('en', `${params.slug}`)
  const recomended_tutorials = await fetchingRelatedTutorials(tutorials.data)
  const {title, cover, author, publishedAt, content, short_description, metadata} = tutorials.data[0].attributes

  return (
    <Suspense key={params.slug}>
      <div className="flex md:flex-row flex-col relative max-w-6xl gap-3">
      
        <div
          className="bg-carbon-200 dark:bg-carbon-900 pb-3 md:pb-6 overflow-hidden flex flex-col gap-3 md:gap-6 my-[-3rem] w-full max-w-5xl"
        >
          <div className="relative w-full h-48 flex justify-center items-center">
            {cover.data && <NextImage
              className='absolute w-full h-full after:absolute after:block after:top-0 after:left-0 after:w-full after:h-full after:bg-carbon-900/40'
              imgClassName='w-full h-full object-cover object-center'
              useSkeleton
              width={cover.data.attributes.width}
              height={cover.data.attributes.height}
              src={MediaUrl(cover.data.attributes.url)}
              alt={cover.data.attributes.alternativeText ?? ''}
            />}
            <h1 className="relative z-10 text-white text-center">{title}</h1>
          </div>

          <div className='w-full flex justify-center gap-1 text-carbon-700 dark:text-carbon-400 font-semibold relative'>
            <Buttonback />
            <address rel="author">{author}</address>
            <span>-</span>
            <time dateTime={publishedAt}>{format(parseISO(publishedAt ?? '1970-01-01'), 'dd/MM/yyyy')}</time>
          </div>

          <div className="px-3 md:px-6 prose prose-carbon dark:prose-invert dark:prose-dark md:prose-md max-w-full prose-h1:italic ">
            <RemoteMDX source={content} />
          </div>
        </div>
        {
          recomended_tutorials.length >= 1 &&
        <div className="flex flex-col items-center gap-4 md:mt-[-3rem] mt-12 max-w-md">
          <img src="https://assettohosting.com/_next/image?url=https%3A%2F%2Fstrapi.assettohosting.com%2Fuploads%2Flogo_2228c8bbfb.png&w=750&q=100" alt="" />
          <p className="font-bold text-xl text-[#fd9500] pl-3 italic">Related tutorials</p>
          <div className="flex flex-wrap justify-center gap-3">

          {
            recomended_tutorials.map(el => (
                <div key={el.id} className='h-44 bg-[#292929] rounded-md flex flex-col text-white w-48'>
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
                <h2 className="mb-2 text-xl font-semibold text-white transition duration-100">{ el.attributes.title.length > 50 ? el.attributes.title.substring(0, 50) + '...' : el.attributes.title}</h2>

                <span className="font-semibold text-indigo-300">Read more</span>
              </div>
            </Link>
           
          </div>
            ))
          }
          </div>
          
        </div>
        }
      </div>
    </Suspense>
  );
}
