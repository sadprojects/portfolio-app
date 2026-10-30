import {
  calculateAge,
  calculateDuration,
  calculateYearsOfExperience,
  formatDateRange,
  getCurrentYear,
} from './dateUtils';

describe('Date Utilities', () => {
  describe('calculateAge', () => {
    it('calculates age correctly', () => {
      const birthDate = '1990-01-01';
      const age = calculateAge(birthDate);

      expect(age).toBeGreaterThan(30);
      expect(typeof age).toBe('number');
    });

    it('handles recent birth dates', () => {
      const birthDate = '2020-01-01';
      const age = calculateAge(birthDate);

      expect(age).toBeLessThan(10);
    });
  });

  describe('calculateYearsOfExperience', () => {
    it('calculates years of experience correctly', () => {
      const firstJobDate = '2015-01-01';
      const experience = calculateYearsOfExperience(firstJobDate);

      expect(experience).toBeGreaterThan(5);
      expect(typeof experience).toBe('number');
    });

    it('handles recent start dates', () => {
      const firstJobDate = '2023-01-01';
      const experience = calculateYearsOfExperience(firstJobDate);

      expect(experience).toBeGreaterThanOrEqual(0);
    });
  });

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

    it('handles exact years with no months', () => {
      const start = '2020-01-01';
      const end = '2022-01-01';
      const duration = calculateDuration(start, end);

      expect(duration).toContain('2 years');
      expect(duration).not.toContain('month');
    });

    it('handles single year duration', () => {
      const start = '2022-01-01';
      const end = '2023-01-01';
      const duration = calculateDuration(start, end);

      expect(duration).toContain('1 year');
      expect(duration).not.toContain('years');
    });

    it('handles single month duration', () => {
      const start = '2023-01-01';
      const end = '2023-02-01';
      const duration = calculateDuration(start, end);

      expect(duration).toContain('1 month');
      expect(duration).not.toContain('months');
    });

    it('describes a role that started this month instead of "0 months"', () => {
      expect(calculateDuration('2023-01-05', '2023-01-20')).toBe(
        'Less than a month',
      );
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

    it('handles case-insensitive "present"', () => {
      const start = '2023-01-01';
      const range1 = formatDateRange(start, 'present');
      const range2 = formatDateRange(start, 'PRESENT');

      expect(range1).toContain('Present');
      expect(range2).toContain('Present');
    });
  });

  describe('getCurrentYear', () => {
    it('returns current year as number', () => {
      const year = getCurrentYear();

      expect(typeof year).toBe('number');
      expect(year).toBeGreaterThanOrEqual(2025);
    });
  });
});
