import { describe, it, expect } from 'vitest';
import { createRequestSlice, RequestSlice } from './requestSlice';

describe('requestSlice', () => {
  let store: RequestSlice;

  beforeEach(() => {
    store = createRequestSlice(
      (state) => state,
      () => ({} as any),
      {} as any,
    ) as any;
  });

  it('should initialize with empty request and history', () => {
    expect(store.request).toEqual({
      emitName: '',
      title: '',
      body: undefined,
      response: undefined,
      duration: undefined,
    });
    expect(store.requestHistory).toEqual([]);
  });

  it('should setRequest with partial update', () => {
    const updated = {
      ...store.request,
      emitName: 'test-event',
      title: 'Test',
    };
    expect(updated.emitName).toBe('test-event');
    expect(updated.title).toBe('Test');
  });

  it('should setRequestHistory', () => {
    const history = [
      { emitName: 'event1', title: 'Request 1', body: '{}' },
    ];
    expect(history).toHaveLength(1);
  });

  it('should upsertHistory - insert new', () => {
    const req = { emitName: 'test', title: 'T1', body: '{}' };
    const updated = [req];
    expect(updated).toHaveLength(1);
    expect(updated[0].title).toBe('T1');
  });

  it('should upsertHistory - update existing', () => {
    const initial = [
      { emitName: 'test', title: 'T1', body: '{}', response: undefined },
    ];
    const updated = { ...initial[0], response: { status: 'ok' } };
    expect(updated.response).toEqual({ status: 'ok' });
  });

  it('should removeFromHistory', () => {
    const initial = [
      { emitName: 'test', title: 'T1', body: '{}' },
      { emitName: 'test2', title: 'T2', body: '{}' },
    ];
    const filtered = initial.filter((r) => r.title !== 'T1');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('T2');
  });
});
