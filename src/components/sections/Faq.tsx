import { MDXRemote } from "next-mdx-remote/rsc";

import { gql, QueryContentComponent } from "@/lib/graphql";

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
    <section className="w-full max-w-screen-sm px-3 md:px-6 lg:px-12 flex flex-col items-center justify-center gap-3">
      {small_text && <p className="font-semibold text-primary-600">{small_text}</p>}
      <h2 className="">{title}</h2>
      {items.map((item, index) => (
        <Accordion
          key={item.id}
          initialOpen={index === 0}
          response={<MDXRemote source={item.response} />}
        >
          <h4>{item.question}</h4>
        </Accordion>
      ))}
    </section>
  )
}

export default Faq;