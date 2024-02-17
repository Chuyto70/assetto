

import { gql, QueryContentComponent } from "@/lib/graphql";

import ElfsightWrapper from "@/components/elements/ElfsightWrapper";

import { useServer } from "@/store/serverStore";
import Tutorials from "./Tutorials";

const ComponentSectionsTestimonials = gql`
  fragment sectionTestimonials on ComponentSectionsTestimonials {
    title
    elfsight_id
    modern
  }
`;

type dataType = {
  data: {
    attributes: {
      content: {
        title?: string;
        elfsight_id: string;
        modern: boolean;
      }[];
    };
  };
};


const Testimonials = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentSectionsTestimonials, 'sectionTestimonials');
  const { title, elfsight_id, modern } = content[props.index];

  return (
    <>
    <Tutorials />
    <section suppressHydrationWarning className="w-full px-3 md:px-6 lg:px-12 max-w-screen-2xl flex flex-col items-center gap-6 md:gap-12">
      {title && <h2 className="italic text-center">{title}</h2>}
      <div className="no-eflsight-title eflsight-fix">
        <ElfsightWrapper widgetId={elfsight_id} modern={modern} />
      </div>
    </section>
    </>
  )
}

export default Testimonials;