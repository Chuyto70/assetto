/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Suspense } from "react";

import { gql,QueryContentComponent } from "@/lib/graphql";
import { includeLocaleLink } from "@/lib/helper";
import { Tutorial } from "@/lib/interfaces";

import SwiperElement from "@/components/elements/swiper/Swiper";

import { useServer } from "@/store/serverStore";

const ComponentSectionsTutorials = gql`
  fragment sectionTutorials on ComponentSectionsTutorials {
    title
    text_below
    url_list_tutorials
    tutorials {
      data {
          id
          attributes {
            title
            slug
            short_description
            thumbnail {
              data {
                  id
                  attributes {
                    name
                    alternativeText
                    caption
                    width
                    height
                    url
                    mime
                  }
               }
            }
            cover {
              data {
                  id
                  attributes {
                    name
                    alternativeText
                    caption
                    width
                    height
                    url
                    mime
                  }
               }
            }
            content
            author
            metadata {
              meta_description
            }
            locale
            tags
            updatedAt
            publishedAt
          }
        }
    }
  }
`;
type dataType = {
  data: {
    attributes: {
      content: {
        title: string;
        text_below: string;
        url_list_tutorials: string;
        tutorials: {
          data: Tutorial[];
        };
      }[];
    };
  };
};

const Tutorials = async(props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  
  // const { medias: { data } } = await QueryLatestTutorials('en', 'tutorials')
  try {
    const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsTutorials, 'sectionTutorials');    
    const { title, text_below, tutorials, url_list_tutorials } = content[props.index];
  
    return (
      tutorials.data.length < 1
        ? <p></p>
        : <section id='tutorial' className="w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl flex flex-col items-center gap-6 md:gap-12">
            <h2 className="italic text-center">{title}</h2>
            <Suspense fallback={<p className="w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl flex flex-col items-center gap-6 md:gap-12">Loading tutorials</p>}>
            
              {tutorials && <SwiperElement articles={tutorials} />}
            </Suspense>
            <div className="w-full justify-start">
              <Link href={includeLocaleLink(url_list_tutorials)} className="text-[#fd9500] font-extrabold text-4xl hover:underline transition-all">
                {text_below}
              </Link>

            </div>
          </section>

      
    )
  } catch (error) {
    console.log('ERROR')
    console.log(error)
    return (
      <section id='tutorial' className="w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl flex flex-col items-center gap-6 md:gap-12">
        <h2 className="italic text-center">Our Tutorials</h2>
        
        <p className="text-red-500 w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl flex flex-col items-center gap-6 md:gap-12">Error loading tutorials</p>
      
      </section>
    )
  }

 
}

export default Tutorials;