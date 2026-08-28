// All calendar math happens in UTC to match how due dates are stored (UTC
// midnight from a date-only input) — see the Phase 6 due-date timezone fix.

export function utcDay(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day));
}

export function startOfUtcDay(date: Date) {
  return utcDay(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function addUtcDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function addUtcMonths(date: Date, months: number) {
  return utcDay(date.getUTCFullYear(), date.getUTCMonth() + months, 1);
}

export function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function parseDateParam(value: string | undefined): Date {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return utcDay(year, month - 1, day);
  }
  return startOfUtcDay(new Date());
}

/** The Sunday-to-Saturday grid covering the whole month, including the
 * leading/trailing days from adjacent months needed to fill full weeks. */
export function getMonthGridDays(anchor: Date): Date[] {
  const firstOfMonth = utcDay(anchor.getUTCFullYear(), anchor.getUTCMonth(), 1);
  const gridStart = addUtcDays(firstOfMonth, -firstOfMonth.getUTCDay());

  const lastOfMonth = utcDay(anchor.getUTCFullYear(), anchor.getUTCMonth() + 1, 0);
  const gridEnd = addUtcDays(lastOfMonth, 6 - lastOfMonth.getUTCDay());

  const days: Date[] = [];
  for (let d = gridStart; d <= gridEnd; d = addUtcDays(d, 1)) {
    days.push(d);
  }
  return days;
}

export function getWeekDays(anchor: Date): Date[] {
  // Normalize first: if `anchor` carries a time-of-day (e.g. a raw `new
  // Date()`), addUtcDays would preserve it and the computed boundary would
  // leak partway into the following day, off-by-one including next week's
  // first task in range queries built from these days.
  const start = startOfUtcDay(anchor);
  const weekStart = addUtcDays(start, -start.getUTCDay());
  return Array.from({ length: 7 }, (_, i) => addUtcDays(weekStart, i));
}

export function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatWeekTitle(days: Date[]) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  return `${formatter.format(days[0])} – ${formatter.format(days[days.length - 1])}`;
}

export function formatDayTitle(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}
