import { match } from '@formatjs/intl-localematcher';
import Negotiator, { Headers } from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';

import { Queryi18NLocales } from '@/lib/graphql';

import { defaultLocale, deploymentURL } from '@/constant/env';

let locales: string[] = [defaultLocale];

function getLocaleFromReq(req: Request) {
  const headersObj = Object.fromEntries(req.headers.entries());
  const headers = Object.keys(headersObj).reduce<Headers>((obj, key) => {
    obj[key.toLowerCase()] = headersObj[key];
    return obj;
  }, {});
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale); // -> 'fr'
}

function getLocaleFromCookie(cookie: string) {
  const language = cookie.split(' ');
  return match(language, locales, defaultLocale); // -> 'fr'
}

export async function middleware(req: NextRequest) {
  const { i18NLocales } = await Queryi18NLocales();

  const allLocales = locales.concat(
    i18NLocales.data.map((item) => item.attributes.code)
  );
  locales = Array.from(new Set(allLocales));

  const cookieexpirationDate = new Date(
    Date.now() + 6 * 30 * 24 * 60 * 60 * 1000
  ); // 6 mois

  // Check if there is any supported locale in the pathname
  const pathname = req.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}`) && pathname !== `/${locale}`
  );

  // Check if there is any supported locale in the cookie
  const localeCookie = req.cookies.get('preferred_language')?.value;
  const localeCookieIsMissingLocale = locales.every(
    (locale) => !localeCookie && localeCookie !== locale
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale && localeCookieIsMissingLocale) {
    const locale = getLocaleFromReq(req);

    // e.g. incoming request is /products
    // The new URL is now /fr/products
    const response = NextResponse.redirect(
      new URL(`/${locale}${pathname}`, deploymentURL)
    );
    response.cookies.set('preferred_language', locale, {
      expires: cookieexpirationDate,
      sameSite: true,
      domain: global.process.env.DEPLOYMENT_HOST,
    });
    return response;
  } else if (
    pathnameIsMissingLocale &&
    localeCookie &&
    !localeCookieIsMissingLocale
  ) {
    const locale = getLocaleFromCookie(localeCookie);
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, deploymentURL));
  }

  // Rewrite cookie if it doesn't match the current pathname
  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}`) || pathname === `/${locale}`
  );
  if (
    !pathnameIsMissingLocale &&
    pathnameLocale &&
    localeCookie !== pathnameLocale
  ) {
    const response = NextResponse.next();
    response.cookies.set('preferred_language', pathnameLocale, {
      expires: cookieexpirationDate,
      sameSite: true,
      domain: global.process.env.DEPLOYMENT_HOST,
    });
    return response;
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, images, fonts, api)
    '/((?!_next|images|fonts|api).*)',
  ],
};
