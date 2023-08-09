import { ReactNode } from "react";

import clsxm from "@/lib/clsxm";

import DynamicIcon from "@/components/elements/DynamicIcon";

export enum StatusEnum {
  operational = "operational",
  maintenance = "maintenance",
  degraded = "degraded",
  down = "down",
  unknown = "unknown",
}

const StatusText = (props: { status: StatusEnum; className?: string; icon?: string; children?: ReactNode }) => {
  return (
    <div className={clsxm("px-4 py-2 rounded-full border-2 w-fit flex gap-3 items-center",
      props.status === "operational" ? "bg-green-200 text-green-900 border-green-900" :
        props.status === "maintenance" ? "bg-yellow-200 text-yellow-900 border-yellow-900" :
          props.status === "degraded" ? "bg-orange-200 text-orange-9900 border-orange-900" :
            props.status === "down" ? "bg-red-200 text-red-900 border-red-900" :
              "bg-carbon-400 text-carbon-900 border-carbon-900"
      , props.className)}>
      {props.icon && <DynamicIcon icon={props.icon} />}
      {props.children}
    </div>
  )
}

export default StatusText;