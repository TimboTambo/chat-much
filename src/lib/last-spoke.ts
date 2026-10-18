import { subtractInterval, today, type LocalDate } from '@/lib/dates';
import type { Interval } from '@/lib/interval';

export type LastSpokeOption = 'today' | 'week' | 'month' | 'while' | 'date';

export type LastSpokeChoice = { option: Exclude<LastSpokeOption, 'date'> } | { option: 'date'; date: LocalDate };

export const DEFAULT_LAST_SPOKE: LastSpokeChoice = { option: 'today' };

export const LAST_SPOKE_LABELS: Record<LastSpokeOption, string> = {
  today: 'Today',
  week: 'About a week ago',
  month: 'About a month ago',
  while: 'A while ago',
  date: 'Pick a date',
};

/**
 * Resolves a choice to a calendar date. "A while ago" depends on the interval
 * (today − interval, so the friend is due today), so resolve it at save time.
 */
export function resolveLastSpoke(choice: LastSpokeChoice, interval: Interval, now: LocalDate = today()): LocalDate {
  switch (choice.option) {
    case 'today':
      return now;
    case 'week':
      return subtractInterval(now, { count: 7, unit: 'day' });
    case 'month':
      return subtractInterval(now, { count: 1, unit: 'month' });
    case 'while':
      return subtractInterval(now, interval);
    case 'date':
      return choice.date > now ? now : choice.date;
  }
}
