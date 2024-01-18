import { Fragment } from "react";

import { QueryCookiesSettings } from "@/lib/graphql";

import CookiesAllButton from "@/components/elements/buttons/CookiesAllBtn";
import CookiesSwitch from "@/components/elements/buttons/CookiesSwitch";
import CookieProvider from "@/components/elements/modal/CookieProvider";
import RemoteMDX from "@/components/elements/texts/RemoteMDX";


const Cookies = async (props: {
  lang: string
}) => {

  const cookies = await QueryCookiesSettings(props.lang);

  return (
    <div
      className="text-carbon-900 dark:text-white bg-carbon-200 dark:bg-carbon-900 shadow-xl dark:shadow-carbon-500/10 dark:border-2 rounded-3xl p-3 md:p-6 overflow-hidden flex flex-col gap-3 md:gap-6"
    >
      <CookieProvider cookies={cookies} />

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-3 flex justify-end gap-3 md:gap-6">
          <CookiesAllButton cookies={cookies} />
          <CookiesAllButton cookies={cookies} accept />
        </div>
        {cookies.cookies.map((cookie, index) => <Fragment key={`${cookie.name}-${index}`}>
          <div className="flex flex-col gap-1 col-span-2">
            <RemoteMDX source={cookie.description} />
          </div>
          <div className="flex justify-center items-center">
            <CookiesSwitch cookie={cookie} />
          </div>
        </Fragment>)}
      </div>

    </div>
  )
}

export default Cookies;