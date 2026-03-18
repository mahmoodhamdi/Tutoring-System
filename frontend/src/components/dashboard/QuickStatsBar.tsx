'use client';

import Link from 'next/link';
import { useQuickStats } from '@/hooks/useDashboard';
import {
  CalendarDaysIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  BellIcon,
  UserPlusIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

export function QuickStatsBar() {
  const { data: stats, isLoading } = useQuickStats();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const items = [
    {
      label: 'جلسات اليوم',
      value: stats.today_sessions,
      icon: CalendarDaysIcon,
      href: '/dashboard/sessions?date=today',
      color: 'text-info-600 bg-info-50',
      valueColor: 'text-info-600',
    },
    {
      label: 'مدفوعات معلقة',
      value: stats.pending_payments,
      icon: BanknotesIcon,
      href: '/dashboard/payments?status=pending',
      color: 'text-accent-600 bg-accent-50',
      valueColor: 'text-accent-600',
    },
    {
      label: 'مدفوعات متأخرة',
      value: stats.overdue_payments,
      icon: ExclamationTriangleIcon,
      href: '/dashboard/payments?status=overdue',
      color: stats.overdue_payments > 0 ? 'text-error-600 bg-error-50' : 'text-neutral-500 bg-neutral-100',
      valueColor: stats.overdue_payments > 0 ? 'text-error-600' : 'text-neutral-600',
    },
    {
      label: 'إشعارات جديدة',
      value: stats.unread_notifications,
      icon: BellIcon,
      href: '/dashboard/notifications',
      color: stats.unread_notifications > 0 ? 'text-primary-600 bg-primary-50' : 'text-neutral-500 bg-neutral-100',
      valueColor: stats.unread_notifications > 0 ? 'text-primary-600' : 'text-neutral-600',
    },
    {
      label: 'طلاب جدد هذا الشهر',
      value: stats.new_students_this_month,
      icon: UserPlusIcon,
      href: '/dashboard/students?sort=newest',
      color: 'text-secondary-600 bg-secondary-50',
      valueColor: 'text-secondary-600',
    },
    {
      label: 'امتحانات قادمة',
      value: stats.upcoming_exams,
      icon: AcademicCapIcon,
      href: '/dashboard/exams?tab=upcoming',
      color: 'text-primary-500 bg-primary-50',
      valueColor: 'text-primary-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 stagger-children">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-all duration-200 group card-hover"
          >
            <div className={`p-2.5 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-110 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className={`text-2xl font-extrabold leading-tight ${item.valueColor}`}>
                {item.value}
              </p>
              <p className="text-xs text-neutral-500 leading-snug truncate">{item.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
