/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link';
import  {Grid,Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';

import './style.css'

import { Article, QueryMetaProps } from '@/lib/interfaces';

// Assuming an array of Tutorial objects
type tutorials = {
  articles: 
  { data: Article[], 
    meta: QueryMetaProps 
  }
}
const elementos = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
]
const SwiperElement = ( props : tutorials) => {

  return (
    
       <Swiper
        modules={[Grid, Navigation]}
        grid={{
          rows: 2,
        }}
        loop={true}
        navigation={true}
        autoplay={{
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          }}
          centeredSlides={false}
        breakpoints={{
            0: {
              spaceBetween: 20,
              slidesPerView: 1,
              grid:{ 
                rows: 1
              }
            },
            468: {
              spaceBetween: 20,
              slidesPerView: 2,
              grid:{ 
                rows: 1
              }
            },
            768: {
              spaceBetween: 30,
              slidesPerView: 2
            },
            1024: {
              spaceBetween: 30,
              slidesPerView: 1,
              grid:{ 
                rows: 2
              }
            },
            1280: {
              spaceBetween: 60,
              slidesPerView: 2,
              grid:{ 
                rows: 2
              }
            },
          }}
        className="mySwiper max-w-full w-full h-80 lg:h-96 breakpoint"
      >
        {
          props.articles.data.map(element => (

            <SwiperSlide key={element.id} className='bg-[#292929] rounded-md flex  text-white'>
              <Link href={element.attributes.slug} className='flex h-full w-full flex-col md:flex-row'>

                <div className='min-w-min'>
                  <img src={`https://strapi.assettohosting.com/${element.attributes.thumbnail.data.attributes.url}`} className='w-full min-w-[12rem] md:w-48 h-full overflow-hidden object-cover rounded-tl-md md:rounded-bl-md rounded-tr-md md:rounded-tr-none'/>
                </div>
                <div className='p-4 flex flex-col justify-between'>
                  <p className='text-lg font-bold'>{element.attributes.title}</p>
                  <p className='max-w-[20rem] overflow-ellipsis leading-6 text-sm'>{element.attributes.short_description.length > 50 ? element.attributes.short_description.substring(0, 80) + '...' : element.attributes.short_description}</p>
                  <p className='font-extrabold text-lg'>Check Tutorial</p>
                </div>
              </Link>
            </SwiperSlide>
          ))
        }
        
       {/* {props.articles.data.map((element) => {
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
          })} */}
      </Swiper>
  )
}

export default SwiperElement
