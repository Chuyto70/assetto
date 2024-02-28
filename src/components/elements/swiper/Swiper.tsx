/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';

import './style.css'

import { includeLocaleLink,MediaUrl } from '@/lib/helper';
import { Tutorial } from '@/lib/interfaces';

import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'



// Assuming an array of Tutorial objects
type tutorials = {
  articles: {

    data: Tutorial[], 
  }
}

const SwiperElement = ( props : tutorials) => {
  console.log('PROP')
  console.log(props)
  const [emblaRef, emblaApi] = useEmblaCarousel({loop: false, align: 'start'})
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
      <div className="embla">
      <div className="embla__viewport pl-7" ref={emblaRef}>
        <div className="embla__container gap-3">
          {props.articles.data.map((element) => (
            <Link href={includeLocaleLink(element.attributes.slug)} key={element.attributes.slug} className="flex-shrink-0 basis-4/4 sm:basis-2/4 lg:basis-1/4  w-[250px] bg-white shadow-lg rounded-lg">
              <img
                alt="Tutorial thumbnail"
                className="h-36 w-full object-cover rounded-t-lg"
                height="150"
                src={MediaUrl(element.attributes.thumbnail.data.attributes.url)}
                style={{
                  aspectRatio: "250/150",
                  objectFit: "cover",
                }}
                width="250"
              />
              <div className='p-4 bg-[#292929] text-white'>
                <h3 className="text-xl font-bold mb-1">{element.attributes.title.length > 25 ? element.attributes.title.substring(0, 23) + '...' : element.attributes.title}</h3>
                <p className="text-gray-300 text-sm mb-4">
                  {element.attributes.short_description.length > 40 ? element.attributes.short_description.substring(0, 40) + '...' : element.attributes.short_description}
                  </p>
                <div className='flex'>
                  <span className="flex text-orange-500 bg-transparent border border-orange-500 hover:bg-orange-500 hover:text-white py-2 px-4 mt-2 rounded-lg font-bold">
                    Read more
                  </span>
                </div>
              </div>
            </Link>
              //  <Link href={element.attributes.slug} className='h-36 w-full  embla__slide bg-[#292929] rounded-md flex text-white' key={element.attributes.slug}>

              //   <div className="flex flex-col items-center gap-4 md:flex-row lg:gap-6">
              //     <div className="group relative block h-56 md:h-full w-full shrink-0 self-start overflow-hidden rounded-lg bg-gray-100 shadow-lg md:w-24 lg:w-40">
              //       <img src={MediaUrl(element.attributes.thumbnail.data.attributes.url)} loading="lazy" alt="Photo by Lorenzo Herrera" className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />
              //     </div>

              //     <div className="flex flex-col gap-2">

              //       <h2 className="text-xl font-bold text-gray-800">
              //         <p className="transition duration-100 text-white text-base">{element.attributes.title.length > 30 ? element.attributes.title.substring(0, 30) + '...' : element.attributes.title}</p>
              //       </h2>

              //       <p className="text-gray-500">{element.attributes.short_description.length > 30 ? element.attributes.short_description.substring(0, 30) + '...' : element.attributes.short_description}</p>

              //       <div>
              //         <p className="font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700">Read more</p>
              //       </div>
              //     </div>
              //   </div>
              //  </Link>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

      </div>
    </div>
      //  <Swiper
      //   modules={[Grid, Navigation]}
      //   loop={true}
      //   navigation={true}
      //   autoplay={{
      //       delay: 3000,
      //       stopOnLastSlide: false,
      //       disableOnInteraction: false,
      //     }}
      //     centeredSlides={false}
      //   breakpoints={{
      //       0: {
      //         spaceBetween: 20,
      //         slidesPerView: 1,
      //         grid:{ 
      //           rows: 1
      //         }
      //       },
      //       468: {
      //         spaceBetween: 20,
      //         slidesPerView: 2,
      //         grid:{ 
      //           rows: 1
      //         }
      //       },
      //       768: {
      //         spaceBetween: 30,
      //         slidesPerView: 2
      //       },
      //       1024: {
      //         spaceBetween: 30,
      //         slidesPerView: 2,
      //       },
      //       1280: {
      //         spaceBetween: 60,
      //         slidesPerView: 2,
      //         grid:{ 
      //           rows: 2
      //         }
      //       },
      //     }}
      //   className="mySwiper max-w-full w-full h-80 lg:h-96 breakpoint"
      // >
      //   {
      //     props.articles.data.map(element => (

      //       <SwiperSlide key={element.id} className='bg-[#292929] rounded-md flex  text-white'>
      //         <Link href={element.attributes.slug} className='flex h-full w-full flex-col lg:flex-row'>

      //           <div className='min-w-min max-h-[11rem] lg:max-h-full'>
      //             {/* USAR ESTO EN PRODUCCION */}
      //             {/* <img src={`https://strapi.assettohosting.com/${element.attributes.thumbnail.data.attributes.url}`} className='w-full min-w-[12rem] lg:w-48 h-full overflow-hidden object-cover rounded-tl-md lg:rounded-bl-md rounded-tr-md lg:rounded-tr-none'/> */}
      //             {/* USAR ESTO EN DESARROLLO */}
      //             <img src={`http://127.0.0.1:1337${element.attributes.thumbnail.data.attributes.url}`} className='w-full min-w-[12rem] lg:w-48 h-full overflow-hidden object-cover rounded-tl-md lg:rounded-bl-md rounded-tr-md lg:rounded-tr-none'/>
      //           </div>
      //           <div className='p-4 flex flex-col justify-between'>
      //             <p className='text-lg font-bold'>{element.attributes.title}</p>
      //             <p className='max-w-[20rem] overflow-ellipsis leading-6 text-sm'>{element.attributes.short_description.length > 50 ? element.attributes.short_description.substring(0, 80) + '...' : element.attributes.short_description}</p>
      //             <p className='font-extrabold text-lg'>Check Tutorial</p>
      //           </div>
      //         </Link>
      //       </SwiperSlide>
      //     ))
      //   }
        
      //  {/* {props.articles.data.map((element) => {
      //       return (
      //         <SwiperSlide key={element.id} className=''>
      //           <div className='h-[300px] mb-6'>
                   
      //             <Link
      //             title={element.attributes.title}
      //             href={element.attributes.slug} 
      //             className="group relative flex h-48 flex-col overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-64 xl:h-72 py-4 px-2">
                    
      //             <img src={`https://strapi.assettohosting.com/${element.attributes.thumbnail.data.attributes.url}`} alt="Photo by Minh Pham" className="absolute top-0 right-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

      //             <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent md:via-transparent"></div>

      //             <div className="relative mt-auto p-4">
      //               <span className="block text-sm text-gray-200">{element.attributes.short_description}</span>
      //               <h2 className="mb-2 text-xl font-semibold text-white transition duration-100">{element.attributes.title}</h2>

      //               <span className="font-semibold text-indigo-300">Read more</span>
      //             </div>
      //           </Link>
      //           </div>

      //         </SwiperSlide>
      //       );
      //     })} */}
      // </Swiper>
  )
}

export default SwiperElement
