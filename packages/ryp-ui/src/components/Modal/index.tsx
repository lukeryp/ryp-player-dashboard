import React, { useEffect, useRef, useCallback } from 'react';
import { cn } from '../../lib/cn';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Modal dialog title — required for accessibility */
  title: string;
  /** Hide the visible title (still present for screen readers) */
  hideTitle?: boolean;
  description?: string;
  size?: ModalSize;
  /** Prevent closing on backdrop click */
  preventBackdropClose?: boolean;
  children: React.ReactNode;
  /** Rendered below children — typically action buttons */
  footer?: React.ReactNode;
  className?: string;
}

const sizeStyles: Record<ModalSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
};

/**
 * Modal — glassmorphism dialog with full accessibility support.
 * Traps focus, handles Escape key, restores focus on close.
 *
 * ```tsx
 * <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Edit Round">
 *   <p>Content here</p>
 * </Modal>
 * ```
 */
export function Modal({
  open,
  onClose,
  title,
  hideTitle = false,
  description,
  size = 'md',
  preventBackdropClose = false,
  children,
  footer,
  className,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save and restore focus
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus the dialog after it renders
      requestAnimationFrame(() => {
        dialogRef.current?.focus();
      });
    } else {
      previousFocusRef.current?.focus();
    }
  }, [open]);

  // Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();

      // Focus trap
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!focusable.length) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  const titleId = 'ryp-modal-title';
  const descId = 'ryp-modal-desc';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
        onClick={preventBackdropClose ? undefined : onClose}
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          'relative w-full rounded-2xl border border-white/10',
          'bg-ryp-surface-2/90 backdrop-blur-xl',
          'shadow-ryp-lg focus:outline-none animate-slide-up',
          sizeStyles[size],
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            <h2
              id={titleId}
              className={cn(
                'font-heading text-xl font-bold text-white',
                hideTitle && 'sr-only',
              )}
            >
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-sm text-white/50">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className={cn(
              'ml-4 shrink-0 rounded-lg p-1.5 text-white/40',
              'hover:bg-white/10 hover:text-white',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ryp-green',
              'transition-colors duration-150',
            )}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-white/[0.07] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
