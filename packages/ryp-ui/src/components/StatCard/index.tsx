import React from 'react';
import { cn } from '../../lib/cn';

export type TrendDirection = 'up' | 'down' | 'neutral';
export type StatCardVariant = 'default' | 'green' | 'yellow';

export interface StatCardProps {
  label: string;
  value: string | number;
  /** Relative change e.g. "+2.4" or "-1.1" */
  trend?: string;
  trendDirection?: TrendDirection;
  /** Supplementary context shown below value */
  subLabel?: string;
  icon?: React.ReactNode;
  variant?: StatCardVariant;
  className?: string;
}

const variantStyles: Record<StatCardVariant, string> = {
  default: 'bg-white/[0.04] border-white/[0.08]',
  green:   'bg-ryp-green/[0.08] border-ryp-green/20',
  yellow:  'bg-ryp-yellow/[0.06] border-ryp-yellow/18',
};

const trendColor: Record<TrendDirection, string> = {
  up:      'text-ryp-green',
  down:    'text-ryp-danger',
  neutral: 'text-white/40',
};

function TrendIcon({ direction }: { direction: TrendDirection }) {
  if (direction === 'up') {
    return (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
      </svg>
    );
  }
  if (direction === 'down') {
    return (
      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
    </svg>
  );
}

/**
 * StatCard — metric display card with value, label, trend, and optional icon.
 *
 * ```tsx
 * <StatCard
 *   label="Fairways Hit"
 *   value="64%"
 *   trend="+3.2%"
 *   trendDirection="up"
 *   variant="green"
 * />
 * ```
 */
export function StatCard({
  label,
  value,
  trend,
  trendDirection = 'neutral',
  subLabel,
  icon,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border backdrop-blur-md p-4 flex flex-col gap-3',
        variantStyles[variant],
        className,
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wider font-body">
          {label}
        </p>
        {icon && (
          <span className="text-white/30" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <p className="text-3xl font-bold text-white font-heading leading-none tabular-nums">
        {value}
      </p>

      {/* Footer row */}
      {(trend || subLabel) && (
        <div className="flex items-center justify-between gap-2">
          {trend && (
            <span
              className={cn(
                'flex items-center gap-1 text-xs font-semibold',
                trendColor[trendDirection],
              )}
              aria-label={`Trend: ${trend}`}
            >
              <TrendIcon direction={trendDirection} />
              {trend}
            </span>
          )}
          {subLabel && (
            <span className="text-xs text-white/30 truncate">{subLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
