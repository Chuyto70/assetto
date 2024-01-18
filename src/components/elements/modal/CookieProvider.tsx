'use client';

import { getFromLocalStorage, gtag } from "@/lib/helper";
import { CookiesSetting } from "@/lib/interfaces";

const CookieProvider = ({ cookies }: { cookies: CookiesSetting }) => {
  const { cookies: cookieList } = cookies;

  const localConsent = getFromLocalStorage('consent');
  const parsedLocalConsent = localConsent ? JSON.parse(localConsent) : {};

  const consent = localConsent
    ? cookieList.every((cookie) => Object.hasOwn(parsedLocalConsent, cookie.name))
      ? parsedLocalConsent
      : Object.fromEntries(cookieList.map((cookie) => [cookie.name, cookie.default]))
    : Object.fromEntries(cookieList.map((cookie) => [cookie.name, cookie.default]));

  // const consent = localConsent
  //   ? JSON.parse(localConsent)
  //   : Object.fromEntries(cookieList.map((cookie) => [cookie.name, cookie.default]));

  if (!localConsent) {
    localStorage.setItem('consent', JSON.stringify(consent));
    gtag('consent', 'default', consent);
  }
  return null;
}

export default CookieProvider;