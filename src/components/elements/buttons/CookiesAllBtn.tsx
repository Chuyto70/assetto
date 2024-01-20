'use client';

import clsxm from "@/lib/clsxm";
import { gtag } from "@/lib/helper";
import { CookiesSetting } from "@/lib/interfaces";

import Button from "@/components/elements/buttons/Button";
import { useModalContext } from "@/components/elements/modal/Modal";

import { useServer } from "@/store/serverStore";

const CookiesAllButton = ({ cookies, accept = false, }: { cookies: CookiesSetting, accept?: boolean }) => {
  const { setIsOpen } = useModalContext();
  const translations = useServer.getState().translations;

  const handleClick = () => {
    const consent = Object.fromEntries(cookies.cookies.map((cookie) => {
      return [cookie.name, cookie.mandatory ? 'granted' : accept ? 'granted' : 'denied'];
    }));
    localStorage.setItem('consent', JSON.stringify(consent));
    gtag('consent', 'update', consent);
    setIsOpen && setIsOpen(false);
  }

  return (
    <Button
      className={clsxm(
        !accept && 'bg-carbon-400 hover:bg-carbon-500 dark:bg-carbon-800 dark:hover:bg-carbon-700 text-carbon-900 dark:text-white',
      )}
      onClick={handleClick}
    >{accept ? translations.btn?.accept_all ?? 'Accept all' : translations.btn?.reject_all ?? 'Reject all'}</Button>
  )
}

export default CookiesAllButton;