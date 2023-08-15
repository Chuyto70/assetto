import { ReactNode } from "react";

export default async function RootLayout(props: {
  children: ReactNode
}) {
  return <>
    {props.children}
  </>
}
