import { describe, it, expect } from 'vitest';

// Helper function tests
describe('Helper Functions', () => {
  describe('Array helpers', () => {
    it('creates an array from a range', () => {
      const range = (start: number, end: number) => 
        Array.from({ length: end - start + 1 }, (_, i) => start + i);
      
      const result = range(1, 5);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('chunks array into smaller arrays', () => {
      const chunk = <T,>(arr: T[], size: number): T[][] => {
        return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
          arr.slice(i * size, i * size + size)
        );
      };

      const result = chunk([1, 2, 3, 4, 5, 6], 2);
      expect(result).toEqual([[1, 2], [3, 4], [5, 6]]);
    });
  });

  describe('String helpers', () => {
    it('capitalizes first letter', () => {
      const capitalize = (str: string) => 
        str.charAt(0).toUpperCase() + str.slice(1);
      
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('truncates long strings', () => {
      const truncate = (str: string, length: number) =>
        str.length > length ? str.substring(0, length) + '...' : str;
      
      expect(truncate('Hello world', 5)).toBe('Hello...');
      expect(truncate('Hi', 5)).toBe('Hi');
    });
  });

  describe('Object helpers', () => {
    it('checks if object is empty', () => {
      const isEmpty = (obj: Record<string, any>) => 
        Object.keys(obj).length === 0;
      
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ key: 'value' })).toBe(false);
    });

    it('picks specific keys from object', () => {
      const pick = <T extends Record<string, any>, K extends keyof T>(
        obj: T,
        keys: K[]
      ): Pick<T, K> => {
        const result = {} as Pick<T, K>;
        keys.forEach(key => {
          if (key in obj) result[key] = obj[key];
        });
        return result;
      };

      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    });
  });
});
