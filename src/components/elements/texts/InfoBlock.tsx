import { ReactNode } from "react"

import clsxm from "@/lib/clsxm";

const CautionBlock = (props: { children?: ReactNode, className?: string; }) => {
  return (
    <div className={clsxm(props.className)}>
      {props.children}
    </div>
  )
}

export default CautionBlock;