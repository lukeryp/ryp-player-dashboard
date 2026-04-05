/**
 * RYP Number Formatting Utilities
 *
 * Consistent formatting for golf-domain numbers: scores, handicaps,
 * percentages, distances, and general stats.
 */

// ── Golf Scores ────────────────────────────────────────────────────────────

/**
 * Format score relative to par: "+3", "-1", "E" (even)
 */
export function formatScoreToPar(score: number, par: number): string {
  const diff = score - par;
  if (diff === 0) return 'E';
  if (diff > 0)   return `+${diff}`;
  return String(diff);
}

/**
 * Color class for a score relative to par.
 * Returns a Tailwind text color class.
 */
export function scoreToParColor(score: number, par: number): string {
  const diff = score - par;
  if (diff <= -2) return 'text-ryp-yellow';   // eagle or better
  if (diff === -1) return 'text-ryp-green';   // birdie
  if (diff === 0)  return 'text-white';       // par
  if (diff === 1)  return 'text-white/70';    // bogey
  if (diff === 2)  return 'text-orange-400';  // double
  return 'text-ryp-danger';                   // triple+
}

/**
 * Handicap display: 0 → "0.0", 4.5 → "4.5", -2 → "+2.0" (scratch convention)
 */
export function formatHandicap(handicap: number | null | undefined): string {
  if (handicap == null) return '—';
  if (handicap < 0) return `+${Math.abs(handicap).toFixed(1)}`;
  return handicap.toFixed(1);
}

// ── Percentages ────────────────────────────────────────────────────────────

/**
 * Format a 0–1 ratio as a percentage: 0.643 → "64.3%"
 * @param value  - ratio 0 to 1  (or pass a 0–100 value with isRatio=false)
 * @param digits - decimal places (default 1)
 */
export function formatPercent(value: number, digits = 1, isRatio = true): string {
  const pct = isRatio ? value * 100 : value;
  return `${pct.toFixed(digits)}%`;
}

/**
 * Format a 0–18 hit count as a percentage string: 11/14 → "78.6%"
 */
export function formatHitPercent(hit: number, total: number, digits = 1): string {
  if (total === 0) return '—';
  return formatPercent(hit / total, digits);
}

// ── Distances ─────────────────────────────────────────────────────────────

/**
 * Yards with unit: 285 → "285 yds"
 */
export function formatYards(yards: number | null | undefined): string {
  if (yards == null) return '—';
  return `${Math.round(yards)} yds`;
}

/**
 * Meters with unit: 260 → "260 m"
 */
export function formatMeters(meters: number | null | undefined): string {
  if (meters == null) return '—';
  return `${Math.round(meters)} m`;
}

/**
 * Yards → meters conversion
 */
export function yardsToMeters(yards: number): number {
  return yards * 0.9144;
}

/**
 * Meters → yards conversion
 */
export function metersToYards(meters: number): number {
  return meters / 0.9144;
}

// ── General Stats ──────────────────────────────────────────────────────────

/**
 * Compact number: 1_234_567 → "1.2M", 4500 → "4.5K"
 */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)     return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${abs}`;
}

/**
 * Fixed decimal with fallback for null/undefined: null → "—"
 */
export function formatStat(
  value: number | null | undefined,
  digits = 1,
  suffix = '',
): string {
  if (value == null) return '—';
  return `${value.toFixed(digits)}${suffix}`;
}

/**
 * Putts per round display: 28 → "28", 28.4 → "28.4"
 */
export function formatPutts(putts: number | null | undefined): string {
  return formatStat(putts, putts != null && Number.isInteger(putts) ? 0 : 1);
}

/**
 * Trend string with sign: 2.4 → "+2.4", -1.1 → "-1.1", 0 → "—"
 */
export function formatTrend(delta: number | null | undefined, digits = 1): string {
  if (delta == null || delta === 0) return '—';
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(digits)}`;
}

/**
 * FORGE / Parallax score display (0–100): always shows integer
 */
export function formatScore(score: number | null | undefined): string {
  if (score == null) return '—';
  return Math.round(score).toString();
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

/**
 * Round to a given number of decimal places
 */
export function roundTo(value: number, places: number): number {
  const factor = Math.pow(10, places);
  return Math.round(value * factor) / factor;
}
