
import { gql, QueryContentComponent } from "@/lib/graphql";
import { LinkInterface } from "@/lib/interfaces";

import Link from "@/components/elements/links";

import { useServer } from "@/store/serverStore";

const ComponentElementsLink = gql`
  fragment elementsLink on ComponentElementsLink {
    id
    name
    href
    open_new_tab
    icon
    style
    direction
    variant
    relationship
  }
`;

type dataType = {
  data: {
    attributes: {
      content: LinkInterface[];
    };
  };
};


const SectionLink = async (props: { pageID: number; index: number; pageType: string; }) => {
  const locale = useServer.getState().locale;
  const { data: { attributes: { content } } }: dataType = await QueryContentComponent(locale, props.pageID, props.pageType, [props.pageType], ComponentElementsLink, 'elementsLink');
  const { href, open_new_tab, style, variant, icon, direction, name, relationship } = content[props.index];


  return (
    <Link
      href={href}
      openNewTab={open_new_tab}
      style={style}
      variant={variant}
      icon={icon}
      direction={direction}
      rel={relationship}
    >{name}</Link>
  )
}

export default SectionLink;