'use client';

import TagManager from "react-gtm-module";

const GoogleTag = ({ gtmId }: { gtmId: string }) => {

  if (gtmId) TagManager.initialize({
    gtmId,
  });

  return null;
}

export default GoogleTag;