import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createConnectionSlice, ConnectionSlice } from './connectionSlice';
import { createRequestSlice, RequestSlice } from './requestSlice';
import { createListenerSlice, ListenerSlice } from './listenerSlice';
import { createLogSlice, LogSlice } from './logSlice';
import { createUiSlice, UiSlice } from './uiSlice';
import { SCHEMA_VERSION } from './types';

export type Store = ConnectionSlice & RequestSlice & ListenerSlice & LogSlice & UiSlice;

export const useStore = create<Store>()(
  persist(
    (...args) => ({
      ...createConnectionSlice(...args),
      ...createRequestSlice(...args),
      ...createListenerSlice(...args),
      ...createLogSlice(...args),
      ...createUiSlice(...args),
    }),
    {
      name: 'connection', // localStorage key
      version: SCHEMA_VERSION,
      partialize: (state) => ({
        profiles: state.profiles,
        address: state.address,
        options: state.options,
        schema_version: SCHEMA_VERSION,
      }),
    },
  ),
);

// Re-export all types
export type { ConnectionSlice, RequestSlice, ListenerSlice, LogSlice, UiSlice };
export * from './types';
