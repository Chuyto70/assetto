import { create } from 'zustand';

import { localeProps, PAYMENT_PROVIDER } from '@/lib/interfaces';

export interface ServerState {
  locale: string;
  locales?: localeProps['i18NLocales']['data'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translations: any;
  paymentProvider: PAYMENT_PROVIDER;
  currency: string;
  currencies: string[];
}

export const useServer = create<ServerState>(() => ({
  locale: '',
  translations: {},
  paymentProvider: PAYMENT_PROVIDER.STRIPE,
  currency: '',
  currencies: [],
}));
