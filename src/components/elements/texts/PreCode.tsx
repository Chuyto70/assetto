'use client';

import { ReactNode, useRef } from "react";

import DynamicIcon from "@/components/elements/DynamicIcon";

import { useServer } from "@/store/serverStore";
import { useToaster } from "@/store/toasterStore";

const PreCode = (props: { children?: ReactNode }) => {
  const preRef = useRef<HTMLPreElement | null>(null);
  const translations = useServer.getState().translations;
  const notify = useToaster((state) => state.notify);

  const copyToClipboard = () => {
    if (!preRef.current) return;

    const clipboard = navigator.clipboard;

    if (!clipboard) return;

    clipboard.writeText(preRef.current.innerText).then(() => {
      notify(0, <p>{translations.toaster.copied_to_clipboard}</p>)
    });
  };

  return (
    <div className="relative group/pre-code">
      <button
        onClick={copyToClipboard}
        className="absolute top-4 right-4 p-1 opacity-0 group-hover/pre-code:opacity-100 bg-carbon-700 dark:bg-carbon-950 rounded-full text-xl text-carbon-100 dark:text-carbon-400 hover:text-carbon-50 dark:hover:text-carbon-200 transition-all duration-300"
      >
        <DynamicIcon icon="tabler:clipboard" />
      </button>

      <pre
        ref={preRef}
      >
        {props.children}
      </pre>
    </div>
  );
};

export default PreCode;
