import React from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../Button';

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface EmptyStateProps {
  /** SVG icon or emoji rendered above the heading */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Primary CTA */
  action?: EmptyStateAction;
  /** Secondary CTA */
  secondaryAction?: EmptyStateAction;
  className?: string;
}

/** Default golf-flag icon when none is provided */
function DefaultIcon() {
  return (
    <svg
      className="w-12 h-12 text-white/20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 21V7l9-4 9 4v14M9 21V9h6v12" />
    </svg>
  );
}

/**
 * EmptyState — consistent empty/zero-data screen with optional CTA.
 *
 * ```tsx
 * <EmptyState
 *   title="No rounds yet"
 *   description="Log your first round to start tracking your game."
 *   action={{ label: 'Log Round', onClick: () => router.push('/rounds/new') }}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-6 py-16 gap-4',
        className,
      )}
    >
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
        {icon ?? <DefaultIcon />}
      </div>

      <div className="max-w-xs">
        <h3 className="text-lg font-bold text-white font-heading">{title}</h3>
        {description && (
          <p className="mt-1.5 text-sm text-white/50 font-body leading-relaxed">{description}</p>
        )}
      </div>

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
          {action && (
            <Button variant={action.variant ?? 'primary'} onClick={action.onClick}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant ?? 'ghost'}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
