'use client';

import TagManager from "react-gtm-module";

import { getFromLocalStorage, gtag } from "@/lib/helper";

const GoogleTag = ({ gtmId }: { gtmId: string }) => {

  if ((typeof window !== "undefined") && gtmId) {

    const localConsent = getFromLocalStorage('consent');
    const consent = localConsent ? JSON.parse(localConsent) : {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      personalization_storage: 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    };

    gtag('consent', 'default', consent);

    if (!localConsent) {
      //set default consent to local storage
      localStorage.setItem('consent', JSON.stringify(consent));
      //then open consent modal

    }

    TagManager.initialize({
      gtmId,
    });
  }

  return null;
}

export default GoogleTag;