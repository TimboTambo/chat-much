import type { Interval } from '@/lib/interval';

/**
 * A local calendar date with no time of day, as `YYYY-MM-DD`.
 * Never pass one to `new Date(string)`: that parses it as UTC midnight.
 */
export type LocalDate = string;

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function toLocalDate(date: Date): LocalDate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Midnight local time on the given calendar date. */
export function fromLocalDate(value: LocalDate): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function today(): LocalDate {
  return toLocalDate(new Date());
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function addMonths(value: LocalDate, months: number): LocalDate {
  const [y, m, d] = value.split('-').map(Number);
  const total = y * 12 + (m - 1) + months;
  const year = Math.floor(total / 12);
  const monthIndex = total - year * 12;
  // Clamp to the end of the month: Jan 31 + 1 month = Feb 28/29.
  const day = Math.min(d, daysInMonth(year, monthIndex));
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

function addDays(value: LocalDate, days: number): LocalDate {
  const date = fromLocalDate(value);
  date.setDate(date.getDate() + days);
  return toLocalDate(date);
}

export function addInterval(value: LocalDate, { count, unit }: Interval): LocalDate {
  switch (unit) {
    case 'day':
      return addDays(value, count);
    case 'week':
      return addDays(value, count * 7);
    case 'month':
      return addMonths(value, count);
  }
}

export function subtractInterval(value: LocalDate, { count, unit }: Interval): LocalDate {
  return addInterval(value, { count: -count, unit });
}

/** Due date = last catch-up + interval. */
export function dueDate(lastCatchUp: LocalDate, interval: Interval): LocalDate {
  return addInterval(lastCatchUp, interval);
}

/** "12 Nov", or "12 Nov 2027" outside the current year. */
export function formatLocalDate(value: LocalDate): string {
  const date = fromLocalDate(value);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}
