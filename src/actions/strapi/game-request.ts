"use server";

import { MutationUpsertGameRequest } from "@/lib/graphql";
import logger from "@/lib/logger";

import { GameRequestFormType } from "@/components/elements/forms/GameRequestForm";

export const requestGame = async (data: GameRequestFormType) => {
  try {
    await MutationUpsertGameRequest(data);
  } catch (error) {
    logger(error, 'game-request')
    throw new Error(
      'Oups, there was a problem with your request, please try again later or contact us'
    );
  }
};