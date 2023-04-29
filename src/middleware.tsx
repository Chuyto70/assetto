import { match } from '@formatjs/intl-localematcher';
import Negotiator, { Headers } from 'negotiator';
import { NextRequest, NextResponse } from 'next/server';

import { gql, StrapiClient } from '@/lib/graphql';

import { defaultLocale } from '@/constant/env';

let locales: string[] = [defaultLocale];

type localeProps = {
  i18NLocales: {
    data: [
      {
        attributes: {
          code: string;
        };
      }
    ];
  };
};

function getLocale(req: Request) {
  const headersObj = Object.fromEntries(req.headers.entries());
  const headers = Object.keys(headersObj).reduce<Headers>((obj, key) => {
    obj[key.toLowerCase()] = headersObj[key];
    return obj;
  }, {});
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale); // -> 'fr'
}

export async function middleware(req: NextRequest) {
  const { i18NLocales } = await StrapiClient.request<localeProps>(
    gql`
      query {
        i18NLocales {
          data {
            attributes {
              code
            }
          }
        }
      }
    `
  );

  const allLocales = locales.concat(
    i18NLocales.data.map((item) => item.attributes.code)
  );
  locales = Array.from(new Set(allLocales));

  // Check if there is any supported locale in the pathname
  const pathname = req.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(req);

    // e.g. incoming request is /products
    // The new URL is now /fr/products
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, req.url));
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, fonts, favicon, api)
    '/((?!_next|fonts|favicon|api).*)',
  ],
};
