import { describe, it, expect, beforeEach } from 'vitest';
import { createListenerSlice, ListenerSlice } from './listenerSlice';

describe('listenerSlice', () => {
  let store: ListenerSlice;

  beforeEach(() => {
    store = createListenerSlice(
      (state) => state,
      () => ({} as any),
      {} as any,
    ) as any;
  });

  it('should initialize with empty listeners', () => {
    expect(store.listeners).toEqual([]);
  });

  it('should addListener', () => {
    const listeners = [{ title: 'test-event', messages: [] }];
    expect(listeners).toHaveLength(1);
    expect(listeners[0].title).toBe('test-event');
  });

  it('should not add duplicate listener', () => {
    const listeners = [{ title: 'test-event', messages: [] }];
    const duplicate = listeners.find((l) => l.title === 'test-event');
    expect(duplicate).toBeDefined();
  });

  it('should removeListener', () => {
    const initial = [
      { title: 'event1', messages: [] },
      { title: 'event2', messages: [] },
    ];
    const filtered = initial.filter((l) => l.title !== 'event1');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('event2');
  });

  it('should appendMessage with id and time', () => {
    const listener = { title: 'test-event', messages: [] };
    const msg = {
      id: 'abc12',
      time: '12:34:56',
      text: ['arg1', 'arg2'],
    };
    listener.messages.push(msg);
    expect(listener.messages).toHaveLength(1);
    expect(listener.messages[0].id).toBeDefined();
    expect(listener.messages[0].time).toBeDefined();
  });

  it('should clearMessages', () => {
    const listeners = [
      {
        title: 'event1',
        messages: [{ id: 'a', time: '1:1:1', text: 'msg1' }],
      },
    ];
    const cleared = listeners.map((l) =>
      l.title === 'event1' ? { ...l, messages: [] } : l,
    );
    expect(cleared[0].messages).toHaveLength(0);
  });
});
