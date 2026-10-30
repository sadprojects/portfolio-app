/** Parse 'YYYY-MM-DD' as a local date (no timezone shift). */
const parseISO = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const isPresent = (date: string) => date.toLowerCase() === 'present';

/** Whole months between two dates. */
const monthsBetween = (start: Date, end: Date): number =>
  (end.getFullYear() - start.getFullYear()) * 12 +
  (end.getMonth() - start.getMonth()) -
  (end.getDate() < start.getDate() ? 1 : 0);

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;

const monthYear = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
});

export const calculateAge = (birthDate: string): number =>
  Math.floor(monthsBetween(parseISO(birthDate), new Date()) / 12);

export const calculateYearsOfExperience = (firstJobDate: string): number =>
  Math.floor(monthsBetween(parseISO(firstJobDate), new Date()) / 12);

/** "2 years 3 months", "6 months", "1 year" or "Less than a month". */
export const calculateDuration = (
  startDate: string,
  endDate: string,
): string => {
  const total = monthsBetween(
    parseISO(startDate),
    isPresent(endDate) ? new Date() : parseISO(endDate),
  );
  const years = Math.floor(total / 12);
  const months = total % 12;
  if (total <= 0) return 'Less than a month';
  if (years === 0) return plural(months, 'month');
  if (months === 0) return plural(years, 'year');
  return `${plural(years, 'year')} ${plural(months, 'month')}`;
};

/** "Feb 2024 - Present" */
export const formatDateRange = (startDate: string, endDate: string): string =>
  `${monthYear.format(parseISO(startDate))} - ${isPresent(endDate) ? 'Present' : monthYear.format(parseISO(endDate))}`;

export const getCurrentYear = (): number => new Date().getFullYear();
