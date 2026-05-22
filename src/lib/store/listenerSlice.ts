import { StateCreator } from 'zustand';
import { ListenerType } from './types';
import { nanoid } from 'nanoid';

export interface ListenerSlice {
  listeners: ListenerType[];

  setListeners: (listeners: ListenerType[]) => void;
  addListener: (title: string) => void;
  removeListener: (title: string) => void;
  appendMessage: (eventName: string, args: unknown[]) => void;
  clearMessages: (title: string) => void;
}

export const createListenerSlice: StateCreator<ListenerSlice> = (set) => ({
  listeners: [],

  setListeners: (listeners) =>
    set({ listeners }),

  addListener: (title) =>
    set((state) => {
      if (state.listeners.find((l) => l.title === title)) {
        return state;
      }
      return {
        listeners: [...state.listeners, { title, messages: [] }],
      };
    }),

  removeListener: (title) =>
    set((state) => ({
      listeners: state.listeners.filter((l) => l.title !== title),
    })),

  appendMessage: (eventName, args) =>
    set((state) => {
      const listeners = [...state.listeners];
      const index = listeners.findIndex((l) => l.title === eventName);
      if (index >= 0) {
        const listener = listeners[index];
        listeners[index] = {
          ...listener,
          messages: [
            ...listener.messages,
            {
              id: nanoid(5),
              time: new Date().toISOString().slice(11, 19),
              text: args,
            },
          ],
        };
      }
      return { listeners };
    }),

  clearMessages: (title) =>
    set((state) => ({
      listeners: state.listeners.map((l) =>
        l.title === title ? { ...l, messages: [] } : l,
      ),
    })),
});
