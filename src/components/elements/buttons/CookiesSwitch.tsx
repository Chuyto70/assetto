'use client';

import clsxm from "@/lib/clsxm";
import { gtag } from "@/lib/helper";
import { CookiesSetting } from "@/lib/interfaces";

import Switch from "@/components/elements/buttons/Switch";

const CookiesSwitch = ({ cookie }: { cookie: CookiesSetting["cookies"][0] }) => {

  const localConsent = localStorage.getItem('consent');
  const consent = localConsent ? JSON.parse(localConsent) : {};

  const handleCookieSwitch = (isOn: boolean) => {
    if (cookie.mandatory) return;
    consent[cookie.name] = isOn ? 'granted' : 'denied';
    localStorage.setItem('consent', JSON.stringify(consent));
    gtag('consent', 'update', consent);
  }

  return (
    <Switch toggleIsOn={
      localConsent
        ? consent[cookie.name] === 'granted'
        : cookie.default === 'granted'
    }
      toggle={handleCookieSwitch}
      className={
        clsxm(
          'bg-carbon-200 dark:bg-carbon-900 shadow-carbon-200-inner dark:shadow-carbon-900-inner text-xl md:text-2xl',
          cookie.mandatory ? 'cursor-not-allowed' : 'cursor-pointer'
        )
      }
      toggleClassName="bg-carbon-400 dark:bg-carbon-700"
      toggleIsOnClassName="bg-green-400 dark:bg-green-600"
      isDisabled={cookie.mandatory}
    />
  )
}

export default CookiesSwitch;