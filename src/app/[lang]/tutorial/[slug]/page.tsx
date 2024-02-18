/* eslint-disable @next/next/no-img-element */
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Suspense } from "react";

import { QueryByTagsTutorials, QueryOneTutorial } from "@/lib/graphql";
import { MediaUrl } from "@/lib/helper";
import { Article, QueryMetaProps } from "@/lib/interfaces";

import { Buttonback } from "@/components/elements/buttons/Buttonback";
import RemoteMDX from "@/components/elements/texts/RemoteMDX";
import NextImage from "@/components/NextImage";



async function fetchingRelatedTutorials(tutorial: Article[]) {
    const matches = tutorial[0].attributes.metadata.meta_description?.match(/#\w+\b/g);
    let relatedTutorials: Article[] = [];

    if (matches) {
        const relatedPromises = matches.map(async (tag) => {
            if (relatedTutorials.length <= 6) {
                try {
                    const tutorialRelated = await QueryByTagsTutorials('en', tag);
                    
                    const filtredTutorials = tutorialRelated.articles.data.filter(
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

    return relatedTutorials;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { articles }: {articles: {data: Article[], meta: QueryMetaProps} } = await QueryOneTutorial('en', `tutorial/${params.slug}`)
  const recomended_tutorials = await fetchingRelatedTutorials(articles.data)
  const {title, cover, author, publishedAt, content, short_description, metadata} = articles.data[0].attributes
  console.log('RECOMENDED')
  console.log(recomended_tutorials)

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
            <Buttonback />
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
            <Link href={`/${el.attributes.slug}`} key={el.attributes.slug} className="h-full max-h-[15rem] bg-[#292929] rounded-md flex flex-col text-white w-full max-w-[16rem] p-2">
                <div className='min-w-min'>
                        <img src={`https://strapi.assettohosting.com/${el.attributes.thumbnail.data.attributes.url}`} className='w-full min-w-[12rem] h-full overflow-hidden object-cover rounded-tl-md rounded-bl-md' alt="Image from assetto"/>
                </div>
                <div className='p-4 flex flex-col justify-between'>
                  <p className='text-lg font-bold text-[#fd9500]'>{el.attributes.title}</p>
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
