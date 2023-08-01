import { MDXRemote } from "next-mdx-remote/rsc";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";

import clsxm from "@/lib/clsxm";
import { gql, QueryContentComponent } from "@/lib/graphql";
import { ENUM_MAX_WIDTH_SCREEN } from "@/lib/interfaces";

import PreCode from "@/components/elements/mdx/PreCode";

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
}

const MdxBlock = async (props: { pageID: number; index: number }) => {
  const locale = useServer.getState().locale;
  const { page: { data: { attributes: { content } } } }: dataType = await QueryContentComponent(locale, props.pageID, 'page', ['pages'], ComponentSectionsMdxBlock, 'sectionsMdxBlock');
  const { text, max_width } = content[props.index];

  return (
    <section className={clsxm("mx-3 md:mx-6 lg:mx-12 prose prose-carbon dark:prose-invert dark:prose-dark md:prose-md prose-h1:italic", ENUM_MAX_WIDTH_SCREEN[max_width])}>
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