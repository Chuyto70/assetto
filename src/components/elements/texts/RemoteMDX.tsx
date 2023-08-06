import { MDXRemote } from "next-mdx-remote/rsc";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";

import MdxImage from "@/components/elements/images/MdxImage";
import AlertBlock from "@/components/elements/texts/AlertBlock";
import P from "@/components/elements/texts/P";
import PreCode from "@/components/elements/texts/PreCode";
import StatusText from "@/components/elements/texts/StatusText";
import Table from "@/components/elements/texts/Table";

const components = {
  pre: PreCode,
  table: Table,
  AlertBlock: AlertBlock,
  p: P,
  img: MdxImage,
  StatusText: StatusText
}

const RemoteMDX = (props: { source: string; }) => {
  return (
    <MDXRemote source={props.source} options={{
      mdxOptions: {
        remarkPlugins: [remarkGfm, [remarkEmoji, { accessible: true }]],
        rehypePlugins: [],
        format: 'mdx'
      }
    }}
      components={components}
    />
  )
}

export default RemoteMDX;