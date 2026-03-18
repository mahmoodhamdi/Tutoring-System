'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      icon,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 font-semibold',
      'rounded-xl transition-all duration-200 ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'active:scale-[0.98]'
    );

    const variants = {
      primary: cn(
        'bg-gradient-to-l from-primary-600 to-primary-500 text-white',
        'hover:from-primary-700 hover:to-primary-600 hover:shadow-[0_10px_25px_-5px_rgba(99,102,241,0.3)]',
        'focus-visible:ring-primary-500'
      ),
      secondary: cn(
        'bg-neutral-100 text-neutral-800',
        'hover:bg-neutral-200',
        'focus-visible:ring-neutral-400',
        '[data-theme="dark"]_&:bg-neutral-700 [data-theme="dark"]_&:text-neutral-200'
      ),
      outline: cn(
        'border-2 border-primary-200 text-primary-600 bg-transparent',
        'hover:bg-primary-50 hover:border-primary-300',
        'focus-visible:ring-primary-500'
      ),
      ghost: cn(
        'bg-transparent text-neutral-600',
        'hover:bg-neutral-100',
        'focus-visible:ring-neutral-400'
      ),
      danger: cn(
        'bg-gradient-to-l from-error-600 to-error-500 text-white',
        'hover:from-error-700 hover:to-error-600 hover:shadow-[0_10px_25px_-5px_rgba(239,68,68,0.3)]',
        'focus-visible:ring-error-500'
      ),
      success: cn(
        'bg-gradient-to-l from-success-600 to-success-500 text-white',
        'hover:from-success-700 hover:to-success-600 hover:shadow-[0_10px_25px_-5px_rgba(34,197,94,0.3)]',
        'focus-visible:ring-success-500'
      ),
      accent: cn(
        'bg-gradient-to-l from-accent-500 to-accent-400 text-white',
        'hover:from-accent-600 hover:to-accent-500 hover:shadow-[0_10px_25px_-5px_rgba(245,158,11,0.3)]',
        'focus-visible:ring-accent-500'
      ),
    };

    const sizes = {
      sm: 'h-9 px-3.5 text-sm',
      md: 'h-11 px-5 text-sm',
      lg: 'h-13 px-7 text-base',
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            جاري التحميل...
          </>
        ) : (
          <>
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
