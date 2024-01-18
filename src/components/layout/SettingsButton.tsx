'use client';

import { useState } from "react";

import Button from "@/components/elements/buttons/Button";
import ButtonLink from "@/components/elements/links/ButtonLink";
import Modal from "@/components/elements/modal/Modal";

import { useServer } from "@/store/serverStore";
import { useToaster } from "@/store/toasterStore";

type SettingsButtonProps = {
  children: React.ReactNode;
} & React.ComponentPropsWithRef<'button'>;

const SettingsButton = ({ children, ...rest }: SettingsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const translations = useServer.getState().translations;
  const currencies = useServer.getState().currencies;
  const locales = useServer.getState().locales;
  const locale = useServer.getState().locale;
  const currency = useServer.getState().currency;
  const notify = useToaster((state) => state.notify);

  const handleChangeCurrency = (currency: string) => {
    useServer.setState({ currency });
    const cookieexpirationDate = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `preferred_currency=${currency}; expires=${cookieexpirationDate}; path=/`;
    notify(3, <p>{translations.settings?.change_currency_success}</p>)
  }

  return (
    <>
      <button {...rest}
        onClick={() => setIsOpen((state) => !state)}
      >
        {children}
        <p className="uppercase">{locale} | {currency}</p>
      </button>
      {isOpen && <Modal dismissAction={() => setIsOpen(false)} >
        <div
          className="bg-carbon-200 dark:bg-carbon-900 shadow-xl dark:shadow-carbon-500/10 dark:border-2 rounded-3xl overflow-hidden p-3 md:p-6"
        >
          <div className="flex flex-row flex-wrap gap-3">
            <h4 className="w-full">{translations.settings?.choose_your_language}</h4>
            {locales?.map((locale) => (
              <ButtonLink key={locale.attributes.code}
                href={`/${locale.attributes.code}`}
                variant='primary'
              >
                {locale.attributes.name}
              </ButtonLink>
            ))}
            <h4 className="pt-3 w-full">{translations.settings?.choose_your_currency}</h4>
            {currencies.map((currency) => (
              <Button key={currency}
                variant='primary'
                onClick={() => handleChangeCurrency(currency)}
              >
                {currency}
              </Button>
            ))}
          </div>
        </div>
      </Modal>}
    </>

  )
};

export default SettingsButton;