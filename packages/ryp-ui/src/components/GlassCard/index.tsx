import React from 'react';
import { cn } from '../../lib/cn';

export type GlassCardVariant = 'default' | 'green' | 'yellow' | 'danger';
export type GlassCardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual tint variant — default is neutral glass */
  variant?: GlassCardVariant;
  /** Inner padding preset */
  padding?: GlassCardPadding;
  /** Whether the card lifts on hover */
  hoverable?: boolean;
  /** Render as a different element (e.g. 'section', 'article') */
  as?: React.ElementType;
  children: React.ReactNode;
}

const variantStyles: Record<GlassCardVariant, string> = {
  default: [
    'bg-white/[0.04] border-white/[0.08]',
    'hover:bg-white/[0.07] hover:border-white/[0.14]',
  ].join(' '),
  green: 'bg-ryp-green/[0.08] border-ryp-green/20',
  yellow: 'bg-ryp-yellow/[0.06] border-ryp-yellow/18',
  danger: 'bg-ryp-danger/[0.08] border-ryp-danger/25',
};

const paddingStyles: Record<GlassCardPadding, string> = {
  none: 'p-0',
  sm:   'p-3',
  md:   'p-4',
  lg:   'p-6',
  xl:   'p-8',
};

/**
 * GlassCard — signature glassmorphism surface used across all RYP apps.
 *
 * ```tsx
 * <GlassCard variant="green" padding="lg" hoverable>
 *   <p>Content</p>
 * </GlassCard>
 * ```
 */
export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = false,
      as: Tag = 'div',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <Tag
        ref={ref}
        className={cn(
          'rounded-xl border backdrop-blur-md transition-all duration-200',
          variantStyles[variant],
          paddingStyles[padding],
          hoverable && 'cursor-pointer hover:shadow-ryp-md hover:-translate-y-0.5',
          className,
        )}
        {...rest}
      >
        {children}
      </Tag>
    );
  },
);

GlassCard.displayName = 'GlassCard';
