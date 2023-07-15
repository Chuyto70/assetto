import { MDXRemote } from "next-mdx-remote/rsc";

import { gql, QueryContentComponent } from "@/lib/graphql";

import DynamicIcon from "@/components/elements/DynamicIcon";
import Accordion from "@/components/elements/texts/Accordion";

import { useServer } from "@/store/serverStore";

const ComponentSectionsFaq = gql`
  fragment sectionsFaq on ComponentSectionsFaq {
    small_text
    title
    items {
      id
      question
      response
      initial_open
    }
  }
`;

type dataType = {
  page: {
    data: {
      attributes: {
        content: {
          small_text?: string;
          title: string;
          items: {
            id: number;
            question: string;
            response: string;
            initial_open: boolean;
          }[];
        }[];
      };
    };
  };
};


const Faq = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsFaq, 'sectionsFaq');
  const { small_text, title, items } = content[props.index];


  return (
    <section className="w-full max-w-screen-sm px-3 md:px-6 lg:px-12 flex flex-col items-center justify-center gap-3 md:gap-6">
      <div className="flex flex-col items-center">
        {small_text && <p className="font-semibold text-primary-600">{small_text}</p>}
        <h2 className="">{title}</h2>
      </div>
      {items.map((item) => (
        <Accordion
          key={item.id}
          initialOpen={item.initial_open}
          response={<span className="font-normal text-sm"><MDXRemote source={item.response} /></span>}
          className="bg-carbon-300 dark:bg-carbon-800 rounded-2xl w-full p-6 overflow-hidden flex flex-col gap-3 hover:cursor-pointer"
        >
          <span className="flex justify-between gap-3">
            <h3 className="text-carbon-800 dark:text-carbon-400 text-base">{item.question}</h3>
            <DynamicIcon icon="octicon:chevron-right-12" className="rotate-90 p-1 bg-carbon-400 dark:bg-carbon-700 rounded-full h-6 w-6" />
          </span>
        </Accordion>
      ))}
    </section>
  )
}

export default Faq;