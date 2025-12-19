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
    { status: 'present' as const, icon: CheckIcon, label: 'حاضر', color: 'green' },
    { status: 'absent' as const, icon: XMarkIcon, label: 'غائب', color: 'red' },
    { status: 'late' as const, icon: ClockIcon, label: 'متأخر', color: 'yellow' },
    { status: 'excused' as const, icon: ExclamationCircleIcon, label: 'معذور', color: 'blue' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الطالب</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">الحالة</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">ملاحظات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendances.map((attendance) => (
              <tr key={attendance.student_id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{attendance.student_name}</div>
                  <div className="text-sm text-gray-500">{attendance.student_phone}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1">
                    {statusButtons.map((btn) => {
                      const isSelected = records[attendance.student_id]?.status === btn.status;
                      return (
                        <button
                          key={btn.status}
                          type="button"
                          onClick={() => handleStatusChange(attendance.student_id, btn.status)}
                          className={`p-2 rounded-lg transition-colors ${
                            isSelected
                              ? `bg-${btn.color}-100 text-${btn.color}-700 ring-2 ring-${btn.color}-500`
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title={btn.label}
                        >
                          <btn.icon className="h-5 w-5" />
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
                    className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
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
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الحفظ...' : 'حفظ الحضور'}
        </button>
      </div>
    </div>
  );
}

export default AttendanceForm;
