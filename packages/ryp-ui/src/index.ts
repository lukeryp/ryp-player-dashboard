/**
 * @ryp/ui — Shared RYP Golf Component Library
 *
 * Single entry point. Tree-shake cleanly — only import what you use.
 */

// ── Theme ──────────────────────────────────────────────────────────────────
export { rypTailwindConfig, RYP_COLORS, CHART_COLORS } from './theme';
export type { RypColor } from './theme';

// ── Utility ────────────────────────────────────────────────────────────────
export { cn } from './lib/cn';

// ── Components ─────────────────────────────────────────────────────────────

// GlassCard
export { GlassCard } from './components/GlassCard';
export type { GlassCardProps, GlassCardVariant, GlassCardPadding } from './components/GlassCard';

// Button
export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

// Input
export { Input } from './components/Input';
export type { InputProps, InputType, InputSize } from './components/Input';

// Select
export { Select } from './components/Select';
export type { SelectProps, SelectOption } from './components/Select';

// Modal
export { Modal } from './components/Modal';
export type { ModalProps, ModalSize } from './components/Modal';

// Toast / Notifications
export { ToastProvider, useToast } from './components/Toast';
export type { Toast, ToastInput, ToastVariant } from './components/Toast';

// LoadingSpinner
export { LoadingSpinner } from './components/LoadingSpinner';
export type { LoadingSpinnerProps, SpinnerSize, SpinnerVariant } from './components/LoadingSpinner';

// EmptyState
export { EmptyState } from './components/EmptyState';
export type { EmptyStateProps, EmptyStateAction } from './components/EmptyState';

// PageHeader
export { PageHeader } from './components/PageHeader';
export type { PageHeaderProps, Breadcrumb } from './components/PageHeader';

// StatCard
export { StatCard } from './components/StatCard';
export type { StatCardProps, TrendDirection, StatCardVariant } from './components/StatCard';

// ErrorBoundary
export { ErrorBoundary } from './components/ErrorBoundary';
export type { ErrorBoundaryProps } from './components/ErrorBoundary';

// Charts
export {
  RypLineChart,
  RypBarChart,
  RypAreaChart,
  RypRadarChart,
  RypPieChart,
  RypTooltip,
  ResponsiveContainer,
} from './components/charts';
export type {
  RypLineChartProps,
  RypBarChartProps,
  RypAreaChartProps,
  RypRadarChartProps,
  RypPieChartProps,
  LineSeriesConfig,
  BarSeriesConfig,
  AreaSeriesConfig,
  RadarSeriesConfig,
  PieDataItem,
} from './components/charts';

// ── Utilities ──────────────────────────────────────────────────────────────

// Zod schemas
export {
  UUIDSchema,
  DateTimeSchema,
  DateSchema,
  PlayerSchema,
  CourseSchema,
  ClubSchema,
  ClubTypeSchema,
  RoundSchema,
  TeeColorSchema,
  HoleScoreSchema,
  SwingAnalysisSchema,
  ScoreRelativeSchema,
  PaginationSchema,
  HandednessSchema,
  SwingPlaneSchema,
  SwingTempoSchema,
  getScoreRelative,
  paginatedSchema,
} from './utils/schemas';
export type {
  Player,
  Course,
  Club,
  ClubType,
  Round,
  TeeColor,
  HoleScore,
  SwingAnalysis,
  ScoreRelative,
  Pagination,
} from './utils/schemas';

// API client
export { createApiClient, ApiError } from './utils/api';
export type { ApiClientConfig, ApiRequestOptions, RypApiClient } from './utils/api';

// Supabase
export {
  createRypClient,
  createRypServerClient,
  getCurrentUser,
  signOut,
  unwrap,
  unwrapMaybe,
} from './utils/supabase';
export type { RypUser, RypSupabaseConfig, SupabaseError } from './utils/supabase';

// Date formatting
export {
  formatDate,
  formatDateLong,
  formatDateShort,
  formatDateMonthDay,
  formatDateTime,
  formatTime,
  formatRelative,
  todayISO,
  parseDateISO,
  seasonLabel,
  daysBetween,
} from './utils/dates';

// Number formatting
export {
  formatScoreToPar,
  scoreToParColor,
  formatHandicap,
  formatPercent,
  formatHitPercent,
  formatYards,
  formatMeters,
  yardsToMeters,
  metersToYards,
  formatCompact,
  formatStat,
  formatPutts,
  formatTrend,
  formatScore,
  clamp,
  lerp,
  roundTo,
} from './utils/numbers';
