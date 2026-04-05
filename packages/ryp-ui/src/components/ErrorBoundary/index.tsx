import React, { Component, ErrorInfo } from 'react';
import { cn } from '../../lib/cn';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Custom fallback — receives error + reset callback */
  fallback?: (props: { error: Error; reset: () => void }) => React.ReactNode;
  /** Called when an error is caught — useful for logging */
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * ErrorBoundary — catches render errors and displays branded error UI.
 *
 * ```tsx
 * <ErrorBoundary onError={(e) => logToSentry(e)}>
 *   <RiskyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;

    if (error) {
      if (this.props.fallback) {
        return this.props.fallback({ error, reset: this.reset });
      }
      return <DefaultErrorUI error={error} reset={this.reset} />;
    }

    return this.props.children;
  }
}

// ── Default branded error screen ───────────────────────────────────────────

interface DefaultErrorUIProps {
  error: Error;
  reset: () => void;
}

function DefaultErrorUI({ error, reset }: DefaultErrorUIProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'min-h-[320px] px-6 py-12 gap-6 rounded-xl',
        'border border-ryp-danger/25 bg-ryp-danger/[0.06] backdrop-blur-md',
      )}
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-ryp-danger/10 border border-ryp-danger/20">
        <svg
          className="w-8 h-8 text-ryp-danger"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <div className="max-w-sm">
        <h2 className="text-xl font-bold text-white font-heading">Something went wrong</h2>
        <p className="mt-2 text-sm text-white/50 font-body leading-relaxed">
          An unexpected error occurred. If this keeps happening, please contact support.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <pre className="mt-3 text-left text-xs text-ryp-danger/70 bg-black/30 rounded-lg p-3 overflow-auto max-h-32">
            {error.message}
          </pre>
        )}
      </div>

      <button
        type="button"
        onClick={reset}
        className={cn(
          'inline-flex items-center gap-2 px-5 py-2.5 rounded-lg',
          'bg-ryp-danger text-white text-sm font-semibold font-body',
          'hover:bg-red-400 transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ryp-danger focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        )}
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.389zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
        </svg>
        Try again
      </button>
    </div>
  );
}
