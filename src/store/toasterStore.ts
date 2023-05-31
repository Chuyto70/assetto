import { ReactNode } from 'react';
import { create } from 'zustand';

export enum ToasterTypes {
  'SUCCESS',
  'WARNING',
  'ERROR',
  'INFO',
}

export interface ToasterState {
  notifications: {
    id: number;
    type: ToasterTypes;
    message: string | ReactNode;
  }[];
}

export interface ToasterActions {
  notify: (
    type: ToasterTypes,
    message: string | ReactNode,
    duration?: number
  ) => void;
  close: (id: number) => void;
}

export const useToaster = create<ToasterState & ToasterActions>((set) => ({
  notifications: [],
  notify: (type, message, duration = 3000) =>
    set((state) => {
      const id = Math.floor(Math.random() * 10000);
      setTimeout(() => state.close(id), duration);
      return {
        notifications: [
          ...state.notifications,
          {
            id: id,
            type: type,
            message,
          },
        ],
      };
    }),
  close: (id) =>
    set((state) => {
      return {
        notifications: state.notifications.filter((notif) => notif.id !== id),
      };
    }),
}));
