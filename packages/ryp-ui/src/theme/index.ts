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
  white:       '#ffffff',
  gray100:     '#f3f4f6',
  gray200:     '#e5e7eb',
  gray300:     '#d1d5db',
  gray400:     '#9ca3af',
  gray500:     '#6b7280',
  gray600:     '#4b5563',
  gray700:     '#374151',
  gray800:     '#1f2937',
  gray900:     '#111827',
} as const;

export type RypColor = keyof typeof RYP_COLORS;

export const CHART_COLORS: string[] = [
  '#00af51', // ryp-green
  '#f4ee19', // ryp-yellow
  '#00d463', // ryp-green-light
  '#3b82f6', // info blue
  '#ef4444', // danger red
  '#c9c310', // ryp-yellow-dark
  '#008a40', // ryp-green-dark
  '#60a5fa', // lighter blue
];
