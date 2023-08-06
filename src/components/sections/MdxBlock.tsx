import clsxm from "@/lib/clsxm";
import { gql, QueryContentComponent } from "@/lib/graphql";
import { ENUM_MAX_WIDTH_SCREEN } from "@/lib/interfaces";

import RemoteMDX from "@/components/elements/texts/RemoteMDX";

import { useServer } from "@/store/serverStore";

const ComponentSectionsMdxBlock = gql`
  fragment sectionsMdxBlock on ComponentSectionsMdxBlock {
    text
    max_width
  }
`;

type dataType = {
  page: {
    data: {
      attributes: {
        content: {
          text: string;
          max_width: keyof typeof ENUM_MAX_WIDTH_SCREEN;
        }[];
      };
    };
  };
};

const MdxBlock = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsMdxBlock, 'sectionsMdxBlock');
  const { text, max_width } = content[props.index];

  return (
    <section className={clsxm("px-3 md:px-6 lg:px-12 prose prose-carbon dark:prose-invert dark:prose-dark md:prose-md prose-h1:italic w-full", ENUM_MAX_WIDTH_SCREEN[max_width])}>
      <RemoteMDX source={text} />
    </section>
  )
}

export default MdxBlock;