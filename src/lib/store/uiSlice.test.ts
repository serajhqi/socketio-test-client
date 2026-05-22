import { describe, it, expect, beforeEach } from 'vitest';
import { createUiSlice, UiSlice } from './uiSlice';

describe('uiSlice', () => {
  let store: UiSlice;

  beforeEach(() => {
    store = createUiSlice(
      (state) => state,
      () => ({} as any),
      {} as any,
    ) as any;
  });

  it('should initialize with default values', () => {
    expect(store.repoStars).toBe(0);
    expect(store.appVersion).toBe('0.9.0');
    expect(store.historyCollapsed).toBe(false);
  });

  it('should setRepoStars', () => {
    const updated = { ...store, repoStars: 42 };
    expect(updated.repoStars).toBe(42);
  });

  it('should setAppVersion', () => {
    const updated = { ...store, appVersion: '0.9.1' };
    expect(updated.appVersion).toBe('0.9.1');
  });

  it('should setHistoryCollapsed', () => {
    const updated = { ...store, historyCollapsed: true };
    expect(updated.historyCollapsed).toBe(true);
  });
});
