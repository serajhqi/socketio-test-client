import { StateCreator } from 'zustand';
import {
  ConnectionStatus,
  ServerProfile,
  ConnectionDetails,
} from './types';

export interface ConnectionSlice {
  address: string | null;
  status: ConnectionStatus;
  options: Record<string, unknown>;
  connectionDetails: ConnectionDetails;
  profiles: ServerProfile[];
  activeProfileId: string | null;

  setAddress: (address: string | null) => void;
  setStatus: (status: ConnectionStatus) => void;
  setOptions: (options: Record<string, unknown>) => void;
  setConnectionDetails: (details: Partial<ConnectionDetails>) => void;
  setProfiles: (profiles: ServerProfile[]) => void;
  setActiveProfile: (id: string | null) => void;
  clearSettings: () => void;
}

export const createConnectionSlice: StateCreator<ConnectionSlice> = (set) => ({
  address: null,
  status: 'disconnected',
  options: {},
  connectionDetails: { reconnectionCount: 0 },
  profiles: [],
  activeProfileId: null,

  setAddress: (address) =>
    set({ address }),

  setStatus: (status) =>
    set({ status }),

  setOptions: (options) =>
    set({ options }),

  setConnectionDetails: (details) =>
    set((state) => ({
      connectionDetails: { ...state.connectionDetails, ...details },
    })),

  setProfiles: (profiles) =>
    set({ profiles }),

  setActiveProfile: (id) =>
    set({ activeProfileId: id }),

  clearSettings: () =>
    set({
      address: null,
      status: 'disconnected',
      options: {},
      connectionDetails: { reconnectionCount: 0 },
      activeProfileId: null,
    }),
});
