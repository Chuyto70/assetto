'use client';

import { ReactNode, useEffect, useState } from "react";
import TagManager from "react-gtm-module";

import { getFromLocalStorage, gtag } from "@/lib/helper";

import Modal from "@/components/elements/modal/Modal";

const GoogleTag = ({ gtmId, children }: { gtmId: string; children: ReactNode }) => {

  const [cookiesModalOpen, setCookiesModalOpen] = useState(false);

  useEffect(() => {
    if (gtmId) {
      const localConsent = getFromLocalStorage('consent');

      if (!localConsent) {
        setCookiesModalOpen(true);
      } else {
        gtag('consent', 'default', JSON.parse(localConsent));
      }

      TagManager.initialize({
        gtmId,
      });
    }
  }, [gtmId]);

  return <>
    {gtmId && cookiesModalOpen && <Modal dismissAction={() => setCookiesModalOpen(false)} className="max-w-screen-lg">
      {children}
    </Modal>}
  </>;
}

export default GoogleTag;