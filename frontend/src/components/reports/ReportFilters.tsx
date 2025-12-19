'use client';

import { useGroups } from '@/hooks/useGroups';
import { useStudents } from '@/hooks/useStudents';
import type { ReportFilters } from '@/types/report';
import {
  ATTENDANCE_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  STUDENT_STATUS_LABELS,
  SESSION_STATUS_LABELS,
} from '@/types/report';
import { GRADE_LEVEL_LABELS } from '@/types/dashboard';

interface ReportFiltersProps {
  reportType: string;
  filters: ReportFilters;
  onChange: (filters: ReportFilters) => void;
}

export function ReportFiltersComponent({
  reportType,
  filters,
  onChange,
}: ReportFiltersProps) {
  const { data: groupsData } = useGroups();
  const { data: studentsData } = useStudents({ per_page: 1000 });

  const groups = groupsData?.data || [];
  const students = studentsData?.data || [];

  const showDateRange = ['attendance', 'payments', 'performance', 'sessions', 'financial_summary'].includes(
    reportType
  );
  const showGroup = ['attendance', 'performance', 'students', 'sessions'].includes(reportType);
  const showStudent = ['attendance', 'payments', 'performance'].includes(reportType);
  const showAttendanceStatus = reportType === 'attendance';
  const showPaymentStatus = reportType === 'payments';
  const showStudentStatus = reportType === 'students';
  const showSessionStatus = reportType === 'sessions';
  const showPaymentMethod = reportType === 'payments';
  const showGradeLevel = reportType === 'students';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">فلترة التقرير</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        {showDateRange && (
          <>
            <div>
              <label className="block text-xs text-gray-500 mb-1">من تاريخ</label>
              <input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => onChange({ ...filters, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">إلى تاريخ</label>
              <input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => onChange({ ...filters, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </>
        )}

        {/* Group */}
        {showGroup && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">المجموعة</label>
            <select
              value={filters.group_id || ''}
              onChange={(e) =>
                onChange({ ...filters, group_id: e.target.value ? parseInt(e.target.value) : undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">جميع المجموعات</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Student */}
        {showStudent && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">الطالب</label>
            <select
              value={filters.student_id || ''}
              onChange={(e) =>
                onChange({ ...filters, student_id: e.target.value ? parseInt(e.target.value) : undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">جميع الطلاب</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Attendance Status */}
        {showAttendanceStatus && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">حالة الحضور</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">جميع الحالات</option>
              {Object.entries(ATTENDANCE_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Payment Status */}
        {showPaymentStatus && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">حالة الدفع</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">جميع الحالات</option>
              {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Student Status */}
        {showStudentStatus && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">حالة الطالب</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">جميع الحالات</option>
              {Object.entries(STUDENT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Session Status */}
        {showSessionStatus && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">حالة الجلسة</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">جميع الحالات</option>
              {Object.entries(SESSION_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Payment Method */}
        {showPaymentMethod && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">طريقة الدفع</label>
            <select
              value={filters.payment_method || ''}
              onChange={(e) => onChange({ ...filters, payment_method: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">جميع الطرق</option>
              <option value="cash">نقدي</option>
              <option value="bank_transfer">تحويل بنكي</option>
              <option value="card">بطاقة</option>
              <option value="other">أخرى</option>
            </select>
          </div>
        )}

        {/* Grade Level */}
        {showGradeLevel && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">المرحلة الدراسية</label>
            <select
              value={filters.grade_level || ''}
              onChange={(e) => onChange({ ...filters, grade_level: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">جميع المراحل</option>
              {Object.entries(GRADE_LEVEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="mt-4">
        <button
          onClick={() =>
            onChange({
              start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                .toISOString()
                .split('T')[0],
              end_date: new Date().toISOString().split('T')[0],
            })
          }
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          إعادة تعيين الفلاتر
        </button>
      </div>
    </div>
  );
}
