import { create } from 'zustand';

import { PAYMENT_PROVIDER } from '@/lib/interfaces';

export interface ServerState {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translations: any;
  paymentProvider: PAYMENT_PROVIDER;
}

export const useServer = create<ServerState>(() => ({
  locale: '',
  translations: {},
  paymentProvider: PAYMENT_PROVIDER.STRIPE,
}));
