import { StateCreator } from 'zustand';
import { RequestType } from './types';

export interface RequestSlice {
  request: RequestType;
  requestHistory: RequestType[];

  setRequest: (req: Partial<RequestType>) => void;
  setRequestHistory: (history: RequestType[]) => void;
  upsertHistory: (req: RequestType) => void;
  removeFromHistory: (title: string) => void;
}

export const createRequestSlice: StateCreator<RequestSlice> = (set) => ({
  request: { emitName: '', title: '', body: undefined, response: undefined, duration: undefined },
  requestHistory: [],

  setRequest: (req) =>
    set((state) => ({
      request: { ...state.request, ...req },
    })),

  setRequestHistory: (history) =>
    set({ requestHistory: history }),

  upsertHistory: (req) =>
    set((state) => {
      const index = state.requestHistory.findIndex((r) => r.title === req.title);
      if (index >= 0) {
        const updated = [...state.requestHistory];
        updated[index] = req;
        return { requestHistory: updated };
      }
      return { requestHistory: [...state.requestHistory, req] };
    }),

  removeFromHistory: (title) =>
    set((state) => ({
      requestHistory: state.requestHistory.filter((r) => r.title !== title),
    })),
});
