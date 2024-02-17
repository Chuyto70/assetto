import { Suspense } from "react";

import { QueryOneTutorial } from "@/lib/graphql";

import RemoteMDX from "@/components/elements/texts/RemoteMDX";


export default async function Page({ params }: { params: { slug: string } }) {
  const { articles } = await QueryOneTutorial('en', `tutorial/${params.slug}`)
  const article = articles.data[0]
  return (
    <Suspense fallback={<h1 className="text-white">Loading DATA</h1>}>

      <div className='w-full h-full overflow-hidden max-w-screen-lg px-3 md:px-6 lg:px-12 flex flex-1 flex-col items-center justify-center text-black'>
        <div className="py-6 w-full dark:text-white m:py-8 lg:py-12">
    <div className="mx-auto max-w-screen-md px-4 md:px-8">
         
         <RemoteMDX source={article.attributes.content} />
    </div>
  </div>
        
      </div>
    </Suspense>
  );
}
