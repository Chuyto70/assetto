"use server";

import { QueryLatestArticle, QueryLatestTutorials } from "@/lib/graphql";

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

export const loadMoreTutorials = async (page: number, pageSize: number) => {
  try {
    const res = await QueryLatestTutorials('en', 'tutorial', page, pageSize);
    return res;
  } catch (error) {
    console.log(error)
    throw new Error(
      'Oups, there was a problem with your request, please try again later or contact us'
    );
  }
};