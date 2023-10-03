'use client';

import { ElfsightWidget } from "react-elfsight-widget";

const ElfsightWrapper = (props: { widgetId: string; modern: boolean; }) => {
  return (
    <ElfsightWidget widgetId={props.widgetId} lazy='in-viewport' modern={props.modern} />
  )
}

export default ElfsightWrapper;