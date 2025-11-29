import { differenceInMonths, differenceInYears, format, parseISO } from 'date-fns';

/**
 * Calculate age from birth date
 */
export const calculateAge = (birthDate: string): number => {
  return differenceInYears(new Date(), parseISO(birthDate));
};

/**
 * Calculate years of experience from first job date
 */
export const calculateYearsOfExperience = (firstJobDate: string): number => {
  return differenceInYears(new Date(), parseISO(firstJobDate));
};

/**
 * Calculate duration between two dates
 * Returns a formatted string like "2 years 3 months" or "6 months"
 */
export const calculateDuration = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate);
  const end = endDate.toLowerCase() === 'present' ? new Date() : parseISO(endDate);

  const years = differenceInYears(end, start);
  const months = differenceInMonths(end, start) % 12;

  if (years === 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }

  if (months === 0) {
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }

  return `${years} ${years === 1 ? 'year' : 'years'} ${months} ${months === 1 ? 'month' : 'months'}`;
};

/**
 * Format date range for display
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate);
  const end = endDate.toLowerCase() === 'present' ? 'Present' : format(parseISO(endDate), 'MMM yyyy');

  return `${format(start, 'MMM yyyy')} - ${end}`;
};

/**
 * Get current year
 */
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};
