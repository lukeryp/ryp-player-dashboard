import React from 'react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show spinner and disable interactions */
  loading?: boolean;
  /** Icon rendered before the label */
  iconLeft?: React.ReactNode;
  /** Icon rendered after the label */
  iconRight?: React.ReactNode;
  /** Fill the full width of the container */
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-ryp-green text-black font-semibold',
    'hover:bg-ryp-green-light hover:shadow-glow-green',
    'active:bg-ryp-green-dark active:scale-[0.98]',
    'disabled:bg-ryp-green/40 disabled:text-black/50 disabled:cursor-not-allowed disabled:shadow-none',
  ].join(' '),
  secondary: [
    'bg-transparent border border-ryp-yellow text-ryp-yellow font-semibold',
    'hover:bg-ryp-yellow/10 hover:shadow-glow-yellow',
    'active:bg-ryp-yellow/20 active:scale-[0.98]',
    'disabled:border-ryp-yellow/30 disabled:text-ryp-yellow/30 disabled:cursor-not-allowed',
  ].join(' '),
  danger: [
    'bg-ryp-danger text-white font-semibold',
    'hover:bg-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.35)]',
    'active:bg-red-600 active:scale-[0.98]',
    'disabled:bg-ryp-danger/40 disabled:cursor-not-allowed',
  ].join(' '),
  ghost: [
    'bg-transparent text-white/70 font-medium',
    'hover:bg-white/[0.07] hover:text-white',
    'active:bg-white/[0.12] active:scale-[0.98]',
    'disabled:text-white/30 disabled:cursor-not-allowed',
  ].join(' '),
  link: [
    'bg-transparent text-ryp-green font-medium underline-offset-4 p-0 h-auto',
    'hover:underline hover:text-ryp-green-light',
    'active:text-ryp-green-dark',
    'disabled:text-ryp-green/40 disabled:cursor-not-allowed',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-7  px-2.5 text-xs  rounded-md  gap-1.5',
  sm: 'h-8  px-3   text-sm  rounded-md  gap-1.5',
  md: 'h-10 px-4   text-sm  rounded-lg  gap-2',
  lg: 'h-11 px-5   text-base rounded-lg gap-2',
  xl: 'h-12 px-6   text-base rounded-xl gap-2.5',
};

function Spinner({ size }: { size: ButtonSize }) {
  const sz = { xs: 'w-3 h-3', sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-4 h-4', xl: 'w-5 h-5' }[size];
  return (
    <svg
      className={cn('animate-spin shrink-0', sz)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Button — RYP primary interaction element.
 *
 * ```tsx
 * <Button variant="primary" size="md" loading={isSaving}>Save Round</Button>
 * <Button variant="secondary" iconLeft={<PlusIcon />}>Add Club</Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      className,
      children,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const isLink = variant === 'link';

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center font-body transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ryp-green focus-visible:ring-offset-2 focus-visible:ring-offset-ryp-black',
          !isLink && sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className,
        )}
        {...rest}
      >
        {loading ? (
          <Spinner size={size} />
        ) : (
          iconLeft && <span className="shrink-0" aria-hidden="true">{iconLeft}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && iconRight && (
          <span className="shrink-0" aria-hidden="true">{iconRight}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
