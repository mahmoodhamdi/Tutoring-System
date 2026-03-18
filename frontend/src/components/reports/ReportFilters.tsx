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
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ReportFiltersProps {
  reportType: string;
  filters: ReportFilters;
  onChange: (filters: ReportFilters) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl text-neutral-800 text-sm shadow-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const selectClass =
  'w-full px-3 py-2 border border-neutral-200 bg-white rounded-xl text-neutral-800 text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const labelClass = 'block text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-1';

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

  const handleReset = () => {
    onChange({
      start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        .toISOString()
        .split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-neutral-400" />
          <h3 className="text-sm font-bold text-neutral-800">فلترة التقرير</h3>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 font-medium transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
          إعادة تعيين
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range */}
        {showDateRange && (
          <>
            <div>
              <label className={labelClass}>من تاريخ</label>
              <input
                type="date"
                value={filters.start_date || ''}
                onChange={(e) => onChange({ ...filters, start_date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>إلى تاريخ</label>
              <input
                type="date"
                value={filters.end_date || ''}
                onChange={(e) => onChange({ ...filters, end_date: e.target.value })}
                className={inputClass}
              />
            </div>
          </>
        )}

        {/* Group */}
        {showGroup && (
          <div>
            <label className={labelClass}>المجموعة</label>
            <select
              value={filters.group_id || ''}
              onChange={(e) =>
                onChange({ ...filters, group_id: e.target.value ? parseInt(e.target.value) : undefined })
              }
              className={selectClass}
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
            <label className={labelClass}>الطالب</label>
            <select
              value={filters.student_id || ''}
              onChange={(e) =>
                onChange({ ...filters, student_id: e.target.value ? parseInt(e.target.value) : undefined })
              }
              className={selectClass}
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
            <label className={labelClass}>حالة الحضور</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
              className={selectClass}
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
            <label className={labelClass}>حالة الدفع</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
              className={selectClass}
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
            <label className={labelClass}>حالة الطالب</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
              className={selectClass}
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
            <label className={labelClass}>حالة الجلسة</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onChange({ ...filters, status: e.target.value || undefined })}
              className={selectClass}
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
            <label className={labelClass}>طريقة الدفع</label>
            <select
              value={filters.payment_method || ''}
              onChange={(e) => onChange({ ...filters, payment_method: e.target.value || undefined })}
              className={selectClass}
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
            <label className={labelClass}>المرحلة الدراسية</label>
            <select
              value={filters.grade_level || ''}
              onChange={(e) => onChange({ ...filters, grade_level: e.target.value || undefined })}
              className={selectClass}
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
    </div>
  );
}
