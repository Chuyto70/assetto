import { QueryCookiesSettings } from "@/lib/graphql";
import { includeLocaleLink } from "@/lib/helper";

import CookiesAllButton from "@/components/elements/buttons/CookiesAllBtn";
import ButtonLink from "@/components/elements/links/ButtonLink";
import CookieProvider from "@/components/elements/modal/CookieProvider";

import { useServer } from "@/store/serverStore";


const MiniCookies = async (props: {
  lang: string
}) => {
  const translations = useServer.getState().translations;
  const cookies = await QueryCookiesSettings(props.lang);

  return (
    <div
      className="text-carbon-900 dark:text-white bg-carbon-200 dark:bg-carbon-900 shadow-xl dark:shadow-carbon-500/10 dark:border-2 rounded-3xl p-3 md:p-6 overflow-hidden flex flex-col gap-3 md:gap-6"
    >
      <CookieProvider cookies={cookies} />
      <p>{translations.settings?.cookie_consent ?? 'Cookie consent :'}</p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href={includeLocaleLink("/cookies")} rel="nofollow" className="bg-carbon-400 hover:bg-carbon-500 dark:bg-carbon-800 dark:hover:bg-carbon-700 text-carbon-900 dark:text-white">{translations.btn?.details ?? 'details'}</ButtonLink>
        <CookiesAllButton cookies={cookies} />
        <CookiesAllButton cookies={cookies} accept />
      </div>
    </div>
  )
}

export default MiniCookies;