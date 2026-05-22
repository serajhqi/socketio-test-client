import { StateCreator } from 'zustand';

export interface UiSlice {
  repoStars: number;
  appVersion: string;
  historyCollapsed: boolean;

  setRepoStars: (count: number) => void;
  setAppVersion: (version: string) => void;
  setHistoryCollapsed: (collapsed: boolean) => void;
}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  repoStars: 0,
  appVersion: '0.9.0',
  historyCollapsed: false,

  setRepoStars: (count) =>
    set({ repoStars: count }),

  setAppVersion: (version) =>
    set({ appVersion: version }),

  setHistoryCollapsed: (collapsed) =>
    set({ historyCollapsed: collapsed }),
});
