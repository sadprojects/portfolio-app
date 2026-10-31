const MONTHS_PER_YEAR = 12;

const parseIsoDate = (iso: string): Date => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const isPresent = (date: string) => date.toLowerCase() === 'present';

const wholeMonthsBetween = (start: Date, end: Date): number =>
  (end.getFullYear() - start.getFullYear()) * MONTHS_PER_YEAR +
  (end.getMonth() - start.getMonth()) -
  (end.getDate() < start.getDate() ? 1 : 0);

export const yearsSince = (iso: string): number =>
  Math.floor(
    wholeMonthsBetween(parseIsoDate(iso), new Date()) / MONTHS_PER_YEAR,
  );

const pluralize = (count: number, unit: string) =>
  `${count} ${unit}${count === 1 ? '' : 's'}`;

const monthAndYear = new Intl.DateTimeFormat('en', {
  month: 'short',
  year: 'numeric',
});

export const calculateDuration = (
  startDate: string,
  endDate: string,
): string => {
  const totalMonths = wholeMonthsBetween(
    parseIsoDate(startDate),
    isPresent(endDate) ? new Date() : parseIsoDate(endDate),
  );
  const years = Math.floor(totalMonths / MONTHS_PER_YEAR);
  const months = totalMonths % MONTHS_PER_YEAR;
  if (totalMonths <= 0) return 'Less than a month';
  if (years === 0) return pluralize(months, 'month');
  if (months === 0) return pluralize(years, 'year');
  return `${pluralize(years, 'year')} ${pluralize(months, 'month')}`;
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = monthAndYear.format(parseIsoDate(startDate));
  const end = isPresent(endDate)
    ? 'Present'
    : monthAndYear.format(parseIsoDate(endDate));
  return `${start} - ${end}`;
};
