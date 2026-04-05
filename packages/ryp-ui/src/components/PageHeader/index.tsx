import React from 'react';
import { cn } from '../../lib/cn';

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  /** Content rendered in the top-right (e.g. action buttons) */
  actions?: React.ReactNode;
  /** Optional bottom border separator */
  bordered?: boolean;
  className?: string;
  /** Render breadcrumb links — pass your router's Link component */
  LinkComponent?: React.ElementType;
}

/**
 * PageHeader — consistent top-of-page header with breadcrumbs and action slot.
 *
 * ```tsx
 * <PageHeader
 *   title="Round Detail"
 *   breadcrumbs={[{ label: 'Rounds', href: '/rounds' }, { label: 'Apr 3, 2026' }]}
 *   actions={<Button size="sm">Export</Button>}
 * />
 * ```
 */
export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  bordered = false,
  className,
  LinkComponent = 'a',
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-2 pb-6',
        bordered && 'border-b border-white/[0.08] mb-6',
        className,
      )}
    >
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 flex-wrap">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <li key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <svg
                      className="w-3.5 h-3.5 text-white/20 shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {isLast || !crumb.href ? (
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isLast ? 'text-white/60' : 'text-white/40',
                      )}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <LinkComponent
                      href={crumb.href}
                      className={cn(
                        'text-xs font-medium text-white/40',
                        'hover:text-white/70 transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:underline',
                      )}
                    >
                      {crumb.label}
                    </LinkComponent>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white font-heading truncate">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-white/50 font-body">{subtitle}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </header>
  );
}
