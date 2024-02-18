/* eslint-disable @next/next/no-img-element */
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Suspense } from "react";

import { QueryByTagsTutorials, QueryOneTutorial } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";

import RemoteMDX from "@/components/elements/texts/RemoteMDX";
import NextImage from "@/components/NextImage";

const recomended_tutorials = [1,2]
export default async function Page({ params }: { params: { slug: string } }) {
  const { articles } = await QueryOneTutorial('en', `tutorial/${params.slug}`)

  articles.data[0].attributes.metadata
  const {title, cover, author, publishedAt, content, short_description} = articles.data[0].attributes
  
  const matches = short_description.match(/#\w+\b/g);
  console.log('MATCHES')
  console.log(matches)
  console.log(short_description)
  if(matches){
    matches.map(async (tag)=> {
      const tutorialRelated = await QueryByTagsTutorials('en', tag)
      console.log('tutorialRelated')
      console.log(tutorialRelated)
    })
    const randomTag = matches[Math.floor(Math.random() * matches?.length)]
    console.log(randomTag)
  }


  return (
    <Suspense fallback={<h1 className="text-white">Loading DATA</h1>}>
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
            <Link href="javascript:history.back()" className="text-[#fd9500] text-lg absolute left-6">Go back</Link>
            <address rel="author">{author}</address>
            <span>-</span>
            <time dateTime={publishedAt}>{format(parseISO(publishedAt ?? '1970-01-01'), 'dd/MM/yyyy')}</time>
          </div>

          <div className="px-3 md:px-6 prose prose-carbon dark:prose-invert dark:prose-dark md:prose-md max-w-full prose-h1:italic ">
            <RemoteMDX source={content} />
          </div>
        </div>
        <div className="flex flex-col gap-4 md:mt-[-3rem] mt-12">
          <p className="font-bold text-lg text-[#fd9500] pl-3 ">Related tutorials</p>
          <div className="flex flex-wrap justify-center gap-3">

          {
            recomended_tutorials.map(el => (
            <Link href="#" key={el} className="h-full max-h-[15rem] bg-[#292929] rounded-md flex flex-col text-white w-full max-w-[16rem] p-2">
                <div className='min-w-min'>
                        <img src="https://strapi.assettohosting.com/uploads/thumbnail_ACC_LARGE_2bca6f5e77.png?2024-01-19T02:01:12.429Z" className='w-full min-w-[12rem] h-full overflow-hidden object-cover rounded-tl-md rounded-bl-md' alt="Image from assetto"/>
                </div>
                <div className='p-4 flex flex-col justify-between'>
                  <p className='text-lg font-bold'>Lorem ipsum dolor sit amet</p>
                </div>
              </Link>
            ))
          }
          </div>
          
        </div>
      </div>
    </Suspense>
  );
}
