import { MDXRemote } from "next-mdx-remote/rsc";

import { gql, QueryContentComponent } from "@/lib/graphql";

import { useServer } from "@/store/serverStore";

const ComponentSectionsMdxBlock = gql`
  fragment sectionsMdxBlock on ComponentSectionsMdxBlock {
    text
  }
`;

type dataType = {
  page: {
    data: {
      attributes: {
        content: {
          text: string;
        }[];
      };
    };
  };
};


const MdxBlock = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsMdxBlock, 'sectionsMdxBlock');
  const { text } = content[props.index];

  return (
    <section className="mx-3 md:mx-6 lg:mx-12 prose prose-carbon dark:prose-invert md:prose-md prose-h1:italic">
      <MDXRemote source={text} />
    </section>
  )
}

export default MdxBlock;