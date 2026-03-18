'use client';

import { cn } from '@/lib/utils';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantStyles = {
  success: {
    container: 'bg-success-50 border-success-200',
    icon: 'text-success-500',
    title: 'text-success-700',
    text: 'text-success-600',
    glow: 'shadow-[0_0_0_1px_rgba(34,197,94,0.1)]',
  },
  error: {
    container: 'bg-error-50 border-error-200',
    icon: 'text-error-500',
    title: 'text-error-700',
    text: 'text-error-600',
    glow: 'shadow-[0_0_0_1px_rgba(239,68,68,0.1)]',
  },
  warning: {
    container: 'bg-warning-50 border-warning-200',
    icon: 'text-warning-500',
    title: 'text-warning-700',
    text: 'text-warning-600',
    glow: 'shadow-[0_0_0_1px_rgba(245,158,11,0.1)]',
  },
  info: {
    container: 'bg-info-50 border-info-200',
    icon: 'text-info-500',
    title: 'text-info-700',
    text: 'text-info-600',
    glow: 'shadow-[0_0_0_1px_rgba(59,130,246,0.1)]',
  },
};

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

export function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}: AlertProps) {
  const styles = variantStyles[variant];
  const Icon = icons[variant];

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-4 animate-fade-in',
        styles.container,
        styles.glow,
        className
      )}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', styles.icon)} aria-hidden="true" />
        </div>
        <div className="mr-3 flex-1">
          {title && (
            <h3 className={cn('text-sm font-bold', styles.title)}>
              {title}
            </h3>
          )}
          <div className={cn('text-sm', styles.text, title && 'mt-1')}>
            {children}
          </div>
        </div>
        {onClose && (
          <div className="mr-auto pr-3">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'inline-flex rounded-lg p-1.5 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                styles.icon,
                'hover:bg-white/50'
              )}
            >
              <span className="sr-only">إغلاق</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
