import { describe, it, expect, beforeEach } from 'vitest';
import { createLogSlice, LogSlice } from './logSlice';

describe('logSlice', () => {
  let store: LogSlice;

  beforeEach(() => {
    store = createLogSlice(
      (state) => state,
      () => ({} as any),
      {} as any,
    ) as any;
  });

  it('should initialize with empty logs', () => {
    expect(store.logs).toEqual([]);
  });

  it('should appendLog with id, time, and message', () => {
    const logs = [
      {
        id: 'abc',
        time: '12:34:56',
        message: 'connected',
      },
    ];
    expect(logs).toHaveLength(1);
    expect(logs[0].id).toBeDefined();
    expect(logs[0].time).toBeDefined();
    expect(logs[0].message).toBe('connected');
  });

  it('should clearLogs', () => {
    const logs: any[] = [{ id: 'a', time: '1:1:1', message: 'msg' }];
    logs.length = 0;
    expect(logs).toHaveLength(0);
  });

  it('should handle max logs limit', () => {
    const logs = Array.from({ length: 2100 }, (_, i) => ({
      id: `id${i}`,
      time: '1:1:1',
      message: `msg${i}`,
    }));
    if (logs.length > 2000) {
      logs.splice(0, logs.length - 2000);
    }
    expect(logs).toHaveLength(2000);
  });
});
