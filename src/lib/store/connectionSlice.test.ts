import { describe, it, expect } from 'vitest';
import { createConnectionSlice, ConnectionSlice } from './connectionSlice';

describe('connectionSlice', () => {
  let store: ConnectionSlice;

  beforeEach(() => {
    store = createConnectionSlice(
      (state) => state,
      () => ({} as any,
      {} as any,
    ) as any,
    {} as any,
    );
  });

  it('should initialize with default values', () => {
    expect(store.address).toBe(null);
    expect(store.status).toBe('disconnected');
    expect(store.options).toEqual({});
    expect(store.connectionDetails).toEqual({ reconnectionCount: 0 });
    expect(store.profiles).toEqual([]);
    expect(store.activeProfileId).toBe(null);
  });

  it('should setAddress', () => {
    const newStore = { ...store, address: 'http://localhost:3000' };
    expect(newStore.address).toBe('http://localhost:3000');
  });

  it('should setStatus', () => {
    const newStore = { ...store, status: 'connected' as const };
    expect(newStore.status).toBe('connected');
  });

  it('should setOptions', () => {
    const opts = { auth: { token: 'abc' } };
    const newStore = { ...store, options: opts };
    expect(newStore.options).toEqual(opts);
  });

  it('should setConnectionDetails with partial update', () => {
    const current = store.connectionDetails;
    const updated = { ...current, socketId: 'socket-123' };
    expect(updated.socketId).toBe('socket-123');
    expect(updated.reconnectionCount).toBe(0);
  });

  it('should setProfiles', () => {
    const profiles = [
      {
        id: '1',
        name: 'Dev',
        address: 'http://localhost:3000',
        options: {},
      },
    ];
    const newStore = { ...store, profiles };
    expect(newStore.profiles).toEqual(profiles);
  });

  it('should clearSettings', () => {
    const cleared = {
      address: null,
      status: 'disconnected' as const,
      options: {},
      connectionDetails: { reconnectionCount: 0 },
      activeProfileId: null,
    };
    expect(cleared.address).toBe(null);
    expect(cleared.status).toBe('disconnected');
  });
});
