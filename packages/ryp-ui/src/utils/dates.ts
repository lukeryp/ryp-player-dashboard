/**
 * RYP Date Formatting Utilities
 *
 * Convention: dates are stored as UTC ISO-8601 in DB, displayed in local time.
 * All formatters accept ISO strings or Date objects.
 */

type DateInput = string | Date;

function toDate(input: DateInput): Date {
  return typeof input === 'string' ? new Date(input) : input;
}

// ── Display formatters ─────────────────────────────────────────────────────

/** "Apr 3, 2026" */
export function formatDate(input: DateInput, locale = 'en-US'): string {
  return toDate(input).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** "April 3, 2026" */
export function formatDateLong(input: DateInput, locale = 'en-US'): string {
  return toDate(input).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** "4/3/26" */
export function formatDateShort(input: DateInput, locale = 'en-US'): string {
  return toDate(input).toLocaleDateString(locale, {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
  });
}

/** "Apr 3" (no year) */
export function formatDateMonthDay(input: DateInput, locale = 'en-US'): string {
  return toDate(input).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  });
}

/** "Apr 3, 2026 at 2:30 PM" */
export function formatDateTime(input: DateInput, locale = 'en-US'): string {
  return toDate(input).toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** "2:30 PM" */
export function formatTime(input: DateInput, locale = 'en-US'): string {
  return toDate(input).toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ── Relative time ──────────────────────────────────────────────────────────

/**
 * "just now" | "5m ago" | "3h ago" | "Apr 3" | "Apr 3, 2026"
 *
 * Compact relative time — great for feed timestamps.
 */
export function formatRelative(input: DateInput): string {
  const date = toDate(input);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60)    return 'just now';
  if (diffSec < 3600)  return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) {
    const days = Math.floor(diffSec / 86400);
    return `${days}d ago`;
  }

  // Same year → "Apr 3", different year → "Apr 3, 2026"
  const sameYear = date.getFullYear() === now.getFullYear();
  return sameYear ? formatDateMonthDay(date) : formatDate(date);
}

// ── YYYY-MM-DD helpers ─────────────────────────────────────────────────────

/** Returns today's date as "YYYY-MM-DD" in local time */
export function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parse "YYYY-MM-DD" into a local midnight Date (avoids UTC-offset traps) */
export function parseDateISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
}

/** Season label from a date: "Spring 2026", "Summer 2026", etc. */
export function seasonLabel(input: DateInput): string {
  const date = toDate(input);
  const month = date.getMonth(); // 0-based
  const year  = date.getFullYear();
  if (month >= 2 && month <= 4)  return `Spring ${year}`;
  if (month >= 5 && month <= 7)  return `Summer ${year}`;
  if (month >= 8 && month <= 10) return `Fall ${year}`;
  return `Winter ${year}`;
}

/** Days between two dates (absolute value) */
export function daysBetween(a: DateInput, b: DateInput): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.abs(Math.round((toDate(b).getTime() - toDate(a).getTime()) / msPerDay));
}
