import { MDXRemote } from "next-mdx-remote/rsc";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";

import clsxm from "@/lib/clsxm";
import { gql, QueryContentComponent } from "@/lib/graphql";
import { ENUM_MAX_WIDTH_SCREEN } from "@/lib/interfaces";

import MdxImage from "@/components/elements/images/MdxImage";
import AlertBlock from "@/components/elements/texts/AlertBlock";
import P from "@/components/elements/texts/P";
import PreCode from "@/components/elements/texts/PreCode";
import StatusText from "@/components/elements/texts/StatusText";
import Table from "@/components/elements/texts/Table";

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

const components = {
  pre: PreCode,
  table: Table,
  AlertBlock: AlertBlock,
  p: P,
  img: MdxImage,
  StatusText: StatusText
}

const MdxBlock = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsMdxBlock, 'sectionsMdxBlock');
  const { text, max_width } = content[props.index];

  return (
    <section className={clsxm("px-3 md:px-6 lg:px-12 prose prose-carbon dark:prose-invert dark:prose-dark md:prose-md prose-h1:italic w-full", ENUM_MAX_WIDTH_SCREEN[max_width])}>
      <MDXRemote source={text} options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, [remarkEmoji, { accessible: true }]],
          rehypePlugins: [],
          format: 'mdx'
        }
      }}
        components={components}
      />
    </section>
  )
}

export default MdxBlock;