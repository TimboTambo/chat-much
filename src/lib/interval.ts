export type IntervalUnit = 'day' | 'week' | 'month';

export type Interval = {
  count: number;
  unit: IntervalUnit;
};

export const DEFAULT_INTERVAL: Interval = { count: 1, unit: 'month' };

export const INTERVAL_PRESETS: readonly Interval[] = [
  { count: 1, unit: 'week' },
  { count: 2, unit: 'week' },
  { count: 1, unit: 'month' },
  { count: 3, unit: 'month' },
  { count: 6, unit: 'month' },
];

export const INTERVAL_LIMITS: Record<IntervalUnit, number> = {
  day: 365,
  week: 52,
  month: 24,
};

export const INTERVAL_UNITS: readonly IntervalUnit[] = ['day', 'week', 'month'];

export function clampCount(count: number, unit: IntervalUnit): number {
  if (!Number.isFinite(count)) return 1;
  return Math.min(Math.max(Math.round(count), 1), INTERVAL_LIMITS[unit]);
}

export function isPreset(interval: Interval): boolean {
  return INTERVAL_PRESETS.some((p) => sameInterval(p, interval));
}

export function sameInterval(a: Interval, b: Interval): boolean {
  return a.count === b.count && a.unit === b.unit;
}

export function formatUnit(count: number, unit: IntervalUnit): string {
  return count === 1 ? unit : `${unit}s`;
}

/** "Every week", "Every 2 weeks". */
export function formatInterval({ count, unit }: Interval): string {
  return count === 1 ? `Every ${unit}` : `Every ${count} ${formatUnit(count, unit)}`;
}
