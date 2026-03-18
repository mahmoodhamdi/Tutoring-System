'use client';

import { useState } from 'react';
import { SessionAttendanceData, AttendanceStatus } from '@/types/attendance';
import { CheckIcon, XMarkIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface AttendanceFormProps {
  attendances: SessionAttendanceData[];
  onSubmit: (attendances: { student_id: number; status: AttendanceStatus; notes?: string }[]) => void;
  isSubmitting?: boolean;
}

export function AttendanceForm({ attendances, onSubmit, isSubmitting }: AttendanceFormProps) {
  const [records, setRecords] = useState<Record<number, { status: AttendanceStatus; notes: string }>>(
    Object.fromEntries(
      attendances.map((a) => [a.student_id, { status: a.status, notes: a.notes || '' }])
    )
  );

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleNotesChange = (studentId: number, notes: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes },
    }));
  };

  const handleSubmit = () => {
    const data = Object.entries(records).map(([studentId, record]) => ({
      student_id: parseInt(studentId),
      status: record.status,
      notes: record.notes || undefined,
    }));
    onSubmit(data);
  };

  const statusButtons = [
    {
      status: 'present' as const,
      icon: CheckIcon,
      label: 'حاضر',
      selectedClass: 'bg-success-100 text-success-700 ring-2 ring-success-400',
      hoverClass: 'hover:bg-success-50 hover:text-success-600',
    },
    {
      status: 'absent' as const,
      icon: XMarkIcon,
      label: 'غائب',
      selectedClass: 'bg-error-100 text-error-700 ring-2 ring-error-400',
      hoverClass: 'hover:bg-error-50 hover:text-error-600',
    },
    {
      status: 'late' as const,
      icon: ClockIcon,
      label: 'متأخر',
      selectedClass: 'bg-accent-100 text-accent-700 ring-2 ring-accent-400',
      hoverClass: 'hover:bg-accent-50 hover:text-accent-600',
    },
    {
      status: 'excused' as const,
      icon: ExclamationCircleIcon,
      label: 'معذور',
      selectedClass: 'bg-primary-100 text-primary-700 ring-2 ring-primary-400',
      hoverClass: 'hover:bg-primary-50 hover:text-primary-600',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-100">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">الطالب</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider">الحالة</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">ملاحظات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {attendances.map((attendance, idx) => (
              <tr
                key={attendance.student_id}
                className={idx % 2 === 1 ? 'bg-neutral-50/50' : 'bg-white'}
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-neutral-900">{attendance.student_name}</div>
                  <div className="text-sm text-neutral-500">{attendance.student_phone}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1.5">
                    {statusButtons.map((btn) => {
                      const isSelected = records[attendance.student_id]?.status === btn.status;
                      return (
                        <button
                          key={btn.status}
                          type="button"
                          onClick={() => handleStatusChange(attendance.student_id, btn.status)}
                          className={`p-2 rounded-xl transition-all duration-200 ${
                            isSelected
                              ? btn.selectedClass
                              : `bg-neutral-100 text-neutral-500 ${btn.hoverClass}`
                          }`}
                          title={btn.label}
                        >
                          <btn.icon className="h-4 w-4" />
                        </button>
                      );
                    })}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={records[attendance.student_id]?.notes || ''}
                    onChange={(e) => handleNotesChange(attendance.student_id, e.target.value)}
                    className="block w-full rounded-xl border border-neutral-200 py-1.5 px-3 text-neutral-800 text-sm shadow-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200"
                    placeholder="ملاحظات..."
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="rounded-xl bg-gradient-to-l from-primary-600 to-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:from-primary-700 hover:to-primary-600 transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الحفظ...' : 'حفظ الحضور'}
        </button>
      </div>
    </div>
  );
}

export default AttendanceForm;
