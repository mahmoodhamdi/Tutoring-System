'use client';

import { useState } from 'react';
import { useDashboardStats } from '@/hooks/useDashboard';
import {
  QuickStatsBar,
  StatCard,
  AttendanceChart,
  PaymentChart,
  PerformanceCard,
  RecentActivities,
  UpcomingSessions,
  StudentStats,
} from '@/components/dashboard';
import {
  UsersIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
  });

  const { data, isLoading, error } = useDashboardStats(dateRange);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
            <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
          </div>
          <p className="text-neutral-500 font-medium">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-error-50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-error-600 font-semibold">حدث خطأ في تحميل البيانات</p>
        <p className="text-neutral-500 text-sm mt-1">يرجى المحاولة مرة أخرى</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-extrabold text-neutral-800">لوحة التحكم</h1>
          <p className="text-neutral-500 mt-1">نظرة عامة على النظام</p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <input
            type="date"
            value={dateRange.start_date}
            onChange={(e) =>
              setDateRange({ ...dateRange, start_date: e.target.value })
            }
            className="px-4 py-2.5 border-2 border-neutral-200 rounded-xl text-sm bg-white focus:border-primary-500 focus:ring-0 transition-colors"
          />
          <span className="text-neutral-400 font-medium">إلى</span>
          <input
            type="date"
            value={dateRange.end_date}
            onChange={(e) =>
              setDateRange({ ...dateRange, end_date: e.target.value })
            }
            className="px-4 py-2.5 border-2 border-neutral-200 rounded-xl text-sm bg-white focus:border-primary-500 focus:ring-0 transition-colors"
          />
        </div>
      </div>

      {/* Quick Stats Bar */}
      <QuickStatsBar />

      {/* Overview Stats */}
      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
            <StatCard
              title="إجمالي الطلاب"
              value={data.overview.total_students}
              icon={<UsersIcon className="w-6 h-6" />}
              href="/dashboard/students"
              color="primary"
            />
            <StatCard
              title="المجموعات"
              value={data.overview.total_groups}
              icon={<UserGroupIcon className="w-6 h-6" />}
              href="/dashboard/groups"
              color="blue"
            />
            <StatCard
              title="الجلسات"
              value={data.overview.total_sessions}
              icon={<CalendarDaysIcon className="w-6 h-6" />}
              href="/dashboard/schedule"
              color="green"
            />
            <StatCard
              title="الامتحانات"
              value={data.overview.total_exams}
              icon={<AcademicCapIcon className="w-6 h-6" />}
              href="/dashboard/exams"
              color="purple"
            />
            <StatCard
              title="الاختبارات"
              value={data.overview.total_quizzes}
              icon={<DocumentTextIcon className="w-6 h-6" />}
              href="/dashboard/quizzes"
              color="yellow"
            />
            <StatCard
              title="الإعلانات النشطة"
              value={data.overview.active_announcements}
              icon={<MegaphoneIcon className="w-6 h-6" />}
              href="/dashboard/announcements"
              color="red"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-children">
            <AttendanceChart data={data.attendance} />
            <PaymentChart data={data.payments} />
            <UpcomingSessions data={data.sessions} />
            <StudentStats data={data.students} />
            <PerformanceCard data={data.performance} />
            <RecentActivities />
          </div>
        </>
      )}
    </div>
  );
}
