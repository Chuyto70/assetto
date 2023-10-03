"use server";

import { MutationSendContactMail } from "@/lib/graphql";

import { ContactFormType } from "@/components/elements/forms/ContactForm";

export const sendContactMail = async (locale:string, data: ContactFormType) => {
  try {
    await MutationSendContactMail(locale, data);
  } catch (error) {
    throw new Error(
      'Oups, there was a problem with your request, please try again later or contact us'
    );
  }
}