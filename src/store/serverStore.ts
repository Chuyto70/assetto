import { create } from 'zustand';

export interface ServerState {
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translations: any;
}

export const useServer = create<ServerState>(() => ({
  locale: '',
  translations: {},
}));
