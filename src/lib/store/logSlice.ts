import { StateCreator } from 'zustand';
import { LogType } from './types';
import { nanoid } from 'nanoid';

const MAX_LOGS = 2000;

export interface LogSlice {
  logs: LogType[];

  appendLog: (message: string) => void;
  clearLogs: () => void;
}

export const createLogSlice: StateCreator<LogSlice> = (set) => ({
  logs: [],

  appendLog: (message) =>
    set((state) => {
      const newLogs = [
        ...state.logs,
        {
          id: nanoid(5),
          time: new Date().toISOString().slice(11, 19),
          message,
        },
      ];
      if (newLogs.length > MAX_LOGS) {
        newLogs.splice(0, newLogs.length - MAX_LOGS);
      }
      return { logs: newLogs };
    }),

  clearLogs: () =>
    set({ logs: [] }),
});
