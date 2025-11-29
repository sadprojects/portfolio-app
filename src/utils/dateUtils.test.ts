import { describe, it, expect } from 'vitest';
import { calculateDuration, formatDateRange } from './dateUtils';

describe('Date Utilities', () => {
  describe('calculateDuration', () => {
    it('calculates duration in months correctly', () => {
      const start = '2023-01-01';
      const end = '2023-06-01';
      const duration = calculateDuration(start, end);
      
      expect(duration).toContain('5');
      expect(duration).toContain('month');
    });

    it('calculates duration in years and months', () => {
      const start = '2022-01-01';
      const end = '2023-06-30';
      const duration = calculateDuration(start, end);
      
      expect(duration).toContain('year');
      expect(duration).toContain('month');
    });

    it('handles ongoing positions (Present)', () => {
      const start = '2023-01-01';
      const duration = calculateDuration(start, 'Present');
      
      expect(duration).toBeTruthy();
      expect(typeof duration).toBe('string');
    });
  });

  describe('formatDateRange', () => {
    it('formats date range correctly', () => {
      const start = '2023-01-01';
      const end = '2023-12-31';
      const range = formatDateRange(start, end);
      
      expect(range).toContain('2023');
      expect(range).toContain('-');
    });

    it('shows "Present" for ongoing positions', () => {
      const start = '2023-01-01';
      const range = formatDateRange(start, 'Present');
      
      expect(range).toContain('Present');
    });

    it('formats start date as MMM yyyy', () => {
      const start = '2023-01-15';
      const end = '2023-12-31';
      const range = formatDateRange(start, end);
      
      expect(range).toMatch(/Jan 2023/);
    });
  });
});


