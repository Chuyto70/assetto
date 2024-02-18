/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Suspense } from "react";

import { QueryLatestTutorials } from "@/lib/graphql";
import { includeLocaleLink } from "@/lib/helper";

import SwiperElement from "@/components/elements/swiper/Swiper";


const Tutorials = async() => {

  // const { medias: { data } } = await QueryLatestTutorials('en', 'tutorials')
  try {
    const { articles } = await QueryLatestTutorials('en', 'tutorial')

    return (
      articles.data.length < 5
        ? <p></p>
        : <section id='tutorial' className="w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl flex flex-col items-center gap-6 md:gap-12">
            <h2 className="italic text-center">Our Tutorials</h2>
            <Suspense fallback={<p className="w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl flex flex-col items-center gap-6 md:gap-12">Loading tutorials</p>}>
            
              {articles && <SwiperElement articles={articles} />}
            </Suspense>
            <div className="w-full justify-start">
              <Link href={includeLocaleLink('/tutorial')} className="text-[#fd9500] font-extrabold text-4xl hover:underline transition-all">
                See all tutorials
              </Link>

            </div>
          </section>

      
    )
  } catch (error) {
    return (
      <section id='tutorial' className="w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl flex flex-col items-center gap-6 md:gap-12">
        <h2 className="italic text-center">Our Tutorials</h2>
        
        <p className="text-red-500 w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl flex flex-col items-center gap-6 md:gap-12">Error loading tutorials</p>
      
      </section>
    )
  }

 
}

export default Tutorials;