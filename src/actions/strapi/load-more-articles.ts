"use server";

import { QueryLatestArticle } from "@/lib/graphql";

export const loadMoreArticle = async (locale: string, page: number, pageSize: number) => {
  try {
    const res = await QueryLatestArticle(locale, page, pageSize);
    return res;
  } catch (error) {
    throw new Error(
      'Oups, there was a problem with your request, please try again later or contact us'
    );
  }
};