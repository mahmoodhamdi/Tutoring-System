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
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">حدث خطأ في تحميل البيانات</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600">نظرة عامة على النظام</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={dateRange.start_date}
            onChange={(e) =>
              setDateRange({ ...dateRange, start_date: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <span className="text-gray-500">إلى</span>
          <input
            type="date"
            value={dateRange.end_date}
            onChange={(e) =>
              setDateRange({ ...dateRange, end_date: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Quick Stats Bar */}
      <QuickStatsBar />

      {/* Overview Stats */}
      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance */}
            <AttendanceChart data={data.attendance} />

            {/* Payments */}
            <PaymentChart data={data.payments} />

            {/* Sessions */}
            <UpcomingSessions data={data.sessions} />

            {/* Students */}
            <StudentStats data={data.students} />

            {/* Performance */}
            <PerformanceCard data={data.performance} />

            {/* Recent Activities */}
            <RecentActivities />
          </div>
        </>
      )}
    </div>
  );
}
