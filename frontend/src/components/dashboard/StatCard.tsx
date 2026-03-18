'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
  };
  href?: string;
  color?: 'primary' | 'green' | 'yellow' | 'red' | 'blue' | 'purple';
}

const colorClasses = {
  primary: {
    iconBg: 'bg-primary-50',
    iconText: 'text-primary-600',
    gradient: 'from-primary-500 to-primary-600',
    glow: 'group-hover:shadow-[0_8px_20px_rgba(99,102,241,0.2)]',
  },
  green: {
    iconBg: 'bg-success-50',
    iconText: 'text-success-600',
    gradient: 'from-success-500 to-success-600',
    glow: 'group-hover:shadow-[0_8px_20px_rgba(34,197,94,0.2)]',
  },
  yellow: {
    iconBg: 'bg-accent-50',
    iconText: 'text-accent-600',
    gradient: 'from-accent-400 to-accent-500',
    glow: 'group-hover:shadow-[0_8px_20px_rgba(245,158,11,0.2)]',
  },
  red: {
    iconBg: 'bg-error-50',
    iconText: 'text-error-600',
    gradient: 'from-error-500 to-error-600',
    glow: 'group-hover:shadow-[0_8px_20px_rgba(239,68,68,0.2)]',
  },
  blue: {
    iconBg: 'bg-info-50',
    iconText: 'text-info-600',
    gradient: 'from-info-500 to-info-600',
    glow: 'group-hover:shadow-[0_8px_20px_rgba(59,130,246,0.2)]',
  },
  purple: {
    iconBg: 'bg-purple-50',
    iconText: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600',
    glow: 'group-hover:shadow-[0_8px_20px_rgba(147,51,234,0.2)]',
  },
};

export function StatCard({
  title,
  value,
  icon,
  change,
  href,
  color = 'primary',
}: StatCardProps) {
  const colors = colorClasses[color];

  const content = (
    <div className={`group bg-white rounded-2xl border border-neutral-100 p-5 transition-all duration-300 hover:-translate-y-1 ${colors.glow} cursor-pointer`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-2 text-3xl font-extrabold text-neutral-800">{value}</p>
          {change && (
            <div className="mt-2.5 flex items-center gap-1.5 text-sm">
              {change.type === 'increase' ? (
                <span className="inline-flex items-center gap-0.5 text-success-600 bg-success-50 px-2 py-0.5 rounded-full text-xs font-semibold">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                  {change.value}%
                </span>
              ) : change.type === 'decrease' ? (
                <span className="inline-flex items-center gap-0.5 text-error-600 bg-error-50 px-2 py-0.5 rounded-full text-xs font-semibold">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                  </svg>
                  {change.value}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full text-xs font-semibold">
                  {change.value}%
                </span>
              )}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors.iconBg} ${colors.iconText} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
