import { ReactNode } from "react";

import { includeLocaleLink } from "@/lib/helper";
import { ENUM_ELEMENTS_LINK_DIRECTION, ENUM_ELEMENTS_LINK_STYLE, ENUM_ELEMENTS_LINK_VARIANT } from "@/lib/interfaces";

import Link from "@/components/elements/links";

const MdxLink = (props: { href?: string; openNewTab?: boolean; className?: string; icon?: string; children?: ReactNode; style?: ENUM_ELEMENTS_LINK_STYLE; variant?: ENUM_ELEMENTS_LINK_VARIANT; direction?: ENUM_ELEMENTS_LINK_DIRECTION; }) => {
  return (
    <Link
      href={includeLocaleLink(props.href ?? '/')}
      openNewTab={props.openNewTab}
      style={props.style ?? ENUM_ELEMENTS_LINK_STYLE.primary}
      variant={props.variant}
      icon={props.icon}
      direction={props.direction}
      className={props.className}
    >{props.children}</Link>
  )
}

export default MdxLink;