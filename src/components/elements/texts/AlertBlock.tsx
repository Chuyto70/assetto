import { ReactNode } from "react";

import clsxm from "@/lib/clsxm";

import DynamicIcon from "@/components/elements/DynamicIcon";

const AlertBlock = ({ children, title, icon, className, ...rest }: { children?: ReactNode, title?: string; icon?: string; className?: string }) => {
  return (
    <div className={clsxm('bg-carbon-200 dark:bg-carbon-800 w-fit rounded-2xl p-3 not-prose text-sm md:text-base text-amber-800 dark:text-amber-500 flex flex-col gap-3', className)} {...rest} >
      <div className="flex gap-3 items-center text-base">
        {icon && <DynamicIcon icon={icon} className="w-6 h-6 md:w-8 md:h-8" />}
        {title && <h4 className="m-0">{title}</h4>}
      </div>
      {children}
    </div>
  )
}

export default AlertBlock;