import { format, startOfWeek } from 'date-fns';

export function weekBucketKey(dateISO: string): string {
  return format(startOfWeek(new Date(dateISO)), 'yyyy-MM-dd');
}

export function dayBucketKey(dateISO: string): string {
  return format(new Date(dateISO), 'yyyy-MM-dd');
}

export function isoMonthsAgo(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString();
}
