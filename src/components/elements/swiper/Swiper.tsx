/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link';
import  { Autoplay,Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Article, QueryMetaProps } from '@/lib/interfaces';

// Assuming an array of Tutorial objects
type tutorials = {
  articles: 
  { data: Article[], 
    meta: QueryMetaProps 
  }
}
const SwiperElement = ( props : tutorials) => {

  return (
    
       <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          dynamicBullets: true,
        }}
        loop={true}
        autoplay={{
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          }}
          centeredSlides={false}
        breakpoints={{
            0: {
              spaceBetween: 10,
              slidesPerView: 1,
            },
            468: {
              spaceBetween: 10,
              slidesPerView: 2,
            },
            768: {
              spaceBetween: 15,
              slidesPerView: 3,
            },
            1024: {
              spaceBetween: 15,
              slidesPerView: 4,
            },
            1280: {
              spaceBetween: 30,
              slidesPerView: 5,
            },
          }}
        className="mySwiper max-w-full w-full h-80 lg:h-96 breakpoint"
      >
       {props.articles.data.map((element) => {
            return (
              <SwiperSlide key={element.id} className=''>
                <div className='h-[300px] mb-6'>
                   
                  <Link
                  title={element.attributes.title}
                  href={element.attributes.slug} 
                  className="group relative flex h-48 flex-col overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-64 xl:h-72 py-4 px-2">
                    
                  <img src={`https://strapi.assettohosting.com/${element.attributes.thumbnail.data.attributes.url}`} alt="Photo by Minh Pham" className="absolute top-0 right-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent md:via-transparent"></div>

                  <div className="relative mt-auto p-4">
                    <span className="block text-sm text-gray-200">{element.attributes.short_description}</span>
                    <h2 className="mb-2 text-xl font-semibold text-white transition duration-100">{element.attributes.title}</h2>

                    <span className="font-semibold text-indigo-300">Read more</span>
                  </div>
                </Link>
                </div>

              </SwiperSlide>
            );
          })}
      </Swiper>
  )
}

export default SwiperElement
