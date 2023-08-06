import { ReactNode } from "react";

const Table = ({ children, ...rest }: { children?: ReactNode }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table {...rest} >
        {children}
      </table>
    </div>
  )
}

export default Table;