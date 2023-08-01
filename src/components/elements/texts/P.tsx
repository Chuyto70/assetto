import { ReactNode } from "react"

const P = (props: { children?: ReactNode }) => {
  return (
    <p suppressHydrationWarning >{props.children}</p>
  )
}

export default P