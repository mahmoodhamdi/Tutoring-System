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
    container: 'bg-green-50 border-green-200',
    icon: 'text-green-500',
    title: 'text-green-800',
    text: 'text-green-700',
  },
  error: {
    container: 'bg-red-50 border-red-200',
    icon: 'text-red-500',
    title: 'text-red-800',
    text: 'text-red-700',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-500',
    title: 'text-yellow-800',
    text: 'text-yellow-700',
  },
  info: {
    container: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-500',
    title: 'text-blue-800',
    text: 'text-blue-700',
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
        'rounded-md border p-4',
        styles.container,
        className
      )}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', styles.icon)} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={cn('text-sm font-medium', styles.title)}>
              {title}
            </h3>
          )}
          <div className={cn('text-sm', styles.text, title && 'mt-1')}>
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                styles.icon,
                'hover:bg-opacity-20 hover:bg-gray-500'
              )}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
