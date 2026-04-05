import React, { useId } from 'react';
import { cn } from '../../lib/cn';

export type InputType = 'text' | 'number' | 'email' | 'password' | 'search' | 'tel' | 'url';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  type?: InputType;
  size?: InputSize;
  label?: string;
  hint?: string;
  error?: string;
  /** Icon/element rendered on the left inside the input */
  prefix?: React.ReactNode;
  /** Icon/element rendered on the right inside the input */
  suffix?: React.ReactNode;
  /** Stretch to fill container width */
  fullWidth?: boolean;
}

const sizeStyles: Record<InputSize, { wrapper: string; input: string }> = {
  sm: { wrapper: 'h-8',  input: 'text-sm px-3 py-1.5' },
  md: { wrapper: 'h-10', input: 'text-sm px-3 py-2' },
  lg: { wrapper: 'h-11', input: 'text-base px-4 py-2.5' },
};

/**
 * Input — dark-themed form input with validation states.
 *
 * ```tsx
 * <Input label="Handicap" type="number" min={0} max={54} error={errors.handicap} />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      size = 'md',
      label,
      hint,
      error,
      prefix,
      suffix,
      fullWidth = false,
      id: externalId,
      className,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = externalId ?? generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const hasError = Boolean(error);

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-white/80 font-body"
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            'relative flex items-center rounded-lg border transition-all duration-150',
            'bg-white/[0.04] backdrop-blur-sm',
            sizeStyles[size].wrapper,
            hasError
              ? 'border-ryp-danger/60 focus-within:border-ryp-danger focus-within:ring-1 focus-within:ring-ryp-danger/40'
              : 'border-white/10 focus-within:border-ryp-green/60 focus-within:ring-1 focus-within:ring-ryp-green/20',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          {prefix && (
            <span className="pl-3 text-white/40 shrink-0" aria-hidden="true">
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              [hasError && errorId, hint && hintId].filter(Boolean).join(' ') || undefined
            }
            className={cn(
              'flex-1 bg-transparent outline-none text-white placeholder:text-white/30',
              'disabled:cursor-not-allowed',
              sizeStyles[size].input,
              prefix && 'pl-2',
              suffix && 'pr-2',
              className,
            )}
            {...rest}
          />

          {suffix && (
            <span className="pr-3 text-white/40 shrink-0" aria-hidden="true">
              {suffix}
            </span>
          )}
        </div>

        {hint && !hasError && (
          <p id={hintId} className="text-xs text-white/40">
            {hint}
          </p>
        )}

        {hasError && (
          <p id={errorId} role="alert" className="text-xs text-ryp-danger flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
