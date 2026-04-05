export { default as rypTailwindConfig } from './tailwind.config';

/** RYP brand color constants — use in JS/TS where CSS vars aren't available (e.g. Recharts fills) */
export const RYP_COLORS = {
  green:       '#00af51',
  greenLight:  '#00d463',
  greenDark:   '#008a40',
  yellow:      '#f4ee19',
  yellowLight: '#f9f55a',
  yellowDark:  '#c9c310',
  black:       '#000000',
  surface1:    '#0a0a0a',
  surface2:    '#111111',
  surface3:    '#1a1a1a',
  surface4:    '#222222',
  danger:      '#ef4444',
  info:        '#3b82f6',
  gray400:     '#a3a3a3',
  gray500:     '#737373',
  gray600:     '#525252',
  gray700:     '#404040',
  white:       '#ffffff',
} as const;

export type RypColor = keyof typeof RYP_COLORS;

/** Chart color palette — consistent series colors across all apps */
export const CHART_COLORS = [
  RYP_COLORS.green,
  RYP_COLORS.yellow,
  '#3b82f6',
  '#a855f7',
  '#f97316',
  '#06b6d4',
  '#ec4899',
] as const;
