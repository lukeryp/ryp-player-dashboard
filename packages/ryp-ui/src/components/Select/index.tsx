import React, { useId } from 'react';
import { cn } from '../../lib/cn';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string>
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption<T>[];
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: 'h-8  text-sm  px-3 py-1.5',
  md: 'h-10 text-sm  px-3 py-2',
  lg: 'h-11 text-base px-4 py-2.5',
};

/**
 * Select — dark-themed dropdown with consistent RYP styling.
 *
 * ```tsx
 * <Select
 *   label="Club"
 *   options={clubs.map(c => ({ value: c.id, label: c.name }))}
 *   value={selected}
 *   onChange={e => setSelected(e.target.value)}
 * />
 * ```
 */
export function Select<T extends string = string>({
  options,
  label,
  hint,
  error,
  placeholder,
  size = 'md',
  fullWidth = false,
  id: externalId,
  className,
  disabled,
  ...rest
}: SelectProps<T>) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const hasError = Boolean(error);

  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-white/80 font-body">
          {label}
        </label>
      )}

      <div className={cn('relative', fullWidth && 'w-full')}>
        <select
          id={id}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={
            [hasError && errorId, hint && hintId].filter(Boolean).join(' ') || undefined
          }
          className={cn(
            'w-full appearance-none rounded-lg border transition-all duration-150',
            'bg-ryp-surface-2 text-white pr-9',
            'focus:outline-none',
            sizeStyles[size],
            hasError
              ? 'border-ryp-danger/60 focus:border-ryp-danger focus:ring-1 focus:ring-ryp-danger/40'
              : 'border-white/10 focus:border-ryp-green/60 focus:ring-1 focus:ring-ryp-green/20',
            disabled && 'opacity-50 cursor-not-allowed',
            className,
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40" aria-hidden="true">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </span>
      </div>

      {hint && !hasError && (
        <p id={hintId} className="text-xs text-white/40">{hint}</p>
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
}
