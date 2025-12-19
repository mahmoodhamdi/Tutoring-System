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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'مدفوعات معلقة',
      value: stats.pending_payments,
      icon: BanknotesIcon,
      href: '/dashboard/payments?status=pending',
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: 'مدفوعات متأخرة',
      value: stats.overdue_payments,
      icon: ExclamationTriangleIcon,
      href: '/dashboard/payments?status=overdue',
      color: stats.overdue_payments > 0 ? 'text-red-600 bg-red-50' : 'text-gray-600 bg-gray-50',
    },
    {
      label: 'إشعارات جديدة',
      value: stats.unread_notifications,
      icon: BellIcon,
      href: '/dashboard/notifications',
      color: stats.unread_notifications > 0 ? 'text-primary-600 bg-primary-50' : 'text-gray-600 bg-gray-50',
    },
    {
      label: 'طلاب جدد هذا الشهر',
      value: stats.new_students_this_month,
      icon: UserPlusIcon,
      href: '/dashboard/students?sort=newest',
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'امتحانات قادمة',
      value: stats.upcoming_exams,
      icon: AcademicCapIcon,
      href: '/dashboard/exams?tab=upcoming',
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
