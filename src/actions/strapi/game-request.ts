"use server";

import { MutationUpsertGameRequest } from "@/lib/graphql";

import { GameRequestFormType } from "@/components/elements/forms/GameRequestForm";

export const requestGame = async (data: GameRequestFormType) => {
  try {
    MutationUpsertGameRequest(data);
  } catch (error) {
    throw new Error(
      'Oups, there was a problem with your request, please try again later or contact us'
    );
  }
};