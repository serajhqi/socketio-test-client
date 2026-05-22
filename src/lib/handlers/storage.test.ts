import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readItems, saveRequest, saveListeners, removeRequest, removeListener } from './storage';

describe('storage handler', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('readItems', () => {
    it('should return undefined when key does not exist', () => {
      const result = readItems('nonexistent');
      expect(result).toBeUndefined();
    });

    it('should return array when valid JSON array stored', () => {
      const data = [{ id: '1', name: 'Test' }];
      localStorage.setItem('test-key', JSON.stringify(data));
      const result = readItems('test-key');
      expect(result).toEqual(data);
    });

    it('should return undefined when stored value is not an array', () => {
      localStorage.setItem('test-key', JSON.stringify({ key: 'value' }));
      const result = readItems('test-key');
      expect(result).toBeUndefined();
    });

    it('should return undefined when JSON is invalid', () => {
      localStorage.setItem('test-key', 'invalid json{');
      const result = readItems('test-key');
      expect(result).toBeUndefined();
    });
  });

  describe('removeRequest', () => {
    it('should remove request by title', () => {
      const history = [
        { title: 'Request 1', emitName: 'test' },
        { title: 'Request 2', emitName: 'test2' },
      ];
      localStorage.setItem('history', JSON.stringify(history));

      removeRequest('Request 1');

      const stored = JSON.parse(localStorage.getItem('history') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe('Request 2');
    });

    it('should handle empty history', () => {
      removeRequest('nonexistent');
      const stored = JSON.parse(localStorage.getItem('history') || '[]');
      expect(stored).toEqual([]);
    });
  });

  describe('removeListener', () => {
    it('should remove listener by title', () => {
      const listeners = [
        { title: 'event1', messages: [] },
        { title: 'event2', messages: [] },
      ];
      localStorage.setItem('listeners', JSON.stringify(listeners));

      removeListener('event1');

      const stored = JSON.parse(localStorage.getItem('listeners') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe('event2');
    });

    it('should handle empty listeners', () => {
      removeListener('nonexistent');
      const stored = JSON.parse(localStorage.getItem('listeners') || '[]');
      expect(stored).toEqual([]);
    });
  });
});
