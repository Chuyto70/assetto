import { isAfter, isBefore, parseISO } from 'date-fns';

import { QueryRedirections } from '@/lib/graphql';
import { Redirection } from '@/lib/interfaces';

import { deploymentURL } from '@/constant/env';

type OpenGraphType = {
  siteName: string;
  description: string;
  templateTitle?: string;
  logo?: string;
};

export function openGraph({
  siteName,
  templateTitle,
  description,
  logo = `${deploymentURL}/images/favicon.png`,
}: OpenGraphType): string {
  const ogLogo = encodeURIComponent(logo);
  const ogSiteName = encodeURIComponent(siteName.trim());
  const ogTemplateTitle = templateTitle
    ? encodeURIComponent(templateTitle.trim())
    : undefined;
  const ogDesc = encodeURIComponent(description.trim());

  return `${deploymentURL}/api/open-graph?siteName=${ogSiteName}&description=${ogDesc}&logo=${ogLogo}${
    ogTemplateTitle ? `&templateTitle=${ogTemplateTitle}` : ''
  }`;
}

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (typeof obj1 !== typeof obj2 || obj1 == null || obj2 == null) {
    return false;
  }

  if (Array.isArray(obj1)) {
    if (!Array.isArray(obj2) || obj1.length !== obj2.length) {
      return false;
    }

    for (let i = 0; i < obj1.length; i++) {
      if (!deepEqual(obj1[i], obj2[i])) {
        return false;
      }
    }

    return true;
  }

  if (typeof obj1 === 'object') {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (
        !Object.prototype.hasOwnProperty.call(obj2, key) ||
        !deepEqual(obj1[key], obj2[key])
      ) {
        return false;
      }
    }

    return true;
  }

  return obj1 === obj2;
}

export const MediaUrl = (url: string) => {
  return `${url.startsWith('/') ? process.env.NEXT_PUBLIC_STRAPI_URL : ''}${url}`;
};

export const isOnSale = (
  date_on_sale_from: string | Date | undefined,
  date_on_sale_to: string | Date | undefined
) => {
  if (date_on_sale_from && date_on_sale_to) {
    const currentDate = new Date();
    const fromDate =
      typeof date_on_sale_from === 'string'
        ? parseISO(date_on_sale_from)
        : date_on_sale_from;
    const toDate =
      typeof date_on_sale_to === 'string'
        ? parseISO(date_on_sale_to)
        : date_on_sale_to;

    if (isAfter(currentDate, fromDate) && isBefore(currentDate, toDate))
      return true;
  }
  return false;
};

export function toFixedNumber(num: number, digits: number, base = 10): number {
  const pow = Math.pow(base, digits);
  return Math.round(num * pow) / pow;
}

export async function getAllRedirections(page = 1): Promise<Redirection[]> {
  const { redirections } = await QueryRedirections(page);
  const redirectionData = redirections.data;

  if (redirections.meta.pagination.pageCount <= page) return redirectionData;

  const nextPageRedirections = await getAllRedirections(page + 1);

  return redirectionData.concat(nextPageRedirections);
}