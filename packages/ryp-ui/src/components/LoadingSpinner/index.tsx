import React from 'react';
import { cn } from '../../lib/cn';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SpinnerVariant = 'green' | 'yellow' | 'white';

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  /** Replaces the entire page with a centered spinner */
  fullPage?: boolean;
  /** Accessible label — defaults to "Loading" */
  label?: string;
  className?: string;
}

const sizeMap: Record<SpinnerSize, { outer: string; stroke: number }> = {
  xs: { outer: 'w-4 h-4',   stroke: 2.5 },
  sm: { outer: 'w-5 h-5',   stroke: 2.5 },
  md: { outer: 'w-8 h-8',   stroke: 2.5 },
  lg: { outer: 'w-12 h-12', stroke: 2 },
  xl: { outer: 'w-16 h-16', stroke: 2 },
};

const colorMap: Record<SpinnerVariant, { track: string; arc: string }> = {
  green:  { track: 'rgba(0,175,81,0.15)',  arc: '#00af51' },
  yellow: { track: 'rgba(244,238,25,0.15)', arc: '#f4ee19' },
  white:  { track: 'rgba(255,255,255,0.15)', arc: '#ffffff' },
};

/**
 * LoadingSpinner — RYP branded spinner.
 *
 * ```tsx
 * <LoadingSpinner size="md" variant="green" />
 * <LoadingSpinner fullPage label="Loading your round..." />
 * ```
 */
export function LoadingSpinner({
  size = 'md',
  variant = 'green',
  fullPage = false,
  label = 'Loading',
  className,
}: LoadingSpinnerProps) {
  const { outer, stroke } = sizeMap[size];
  const { track, arc } = colorMap[variant];

  const spinner = (
    <span role="status" aria-label={label} className={cn('inline-flex items-center justify-center', outer, className)}>
      <svg
        className="animate-spin w-full h-full"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx="12" cy="12" r="10"
          stroke={track}
          strokeWidth={stroke}
        />
        {/* Arc */}
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke={arc}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-ryp-black">
        {spinner}
        <p className="text-sm text-white/40 font-body animate-pulse">{label}</p>
      </div>
    );
  }

  return spinner;
}
