'use client';

import { useState } from 'react';
import { ExamResult, Exam, ExamResultStatus } from '@/types/exam';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface ExamResultsTableProps {
  exam: Exam;
  results: ExamResult[];
  onSave: (results: { student_id: number; marks_obtained?: number; status: ExamResultStatus; feedback?: string }[]) => void;
  isSaving?: boolean;
}

export function ExamResultsTable({ exam, results, onSave, isSaving }: ExamResultsTableProps) {
  const [editedResults, setEditedResults] = useState<
    Record<number, { marks_obtained?: number; status: ExamResultStatus; feedback?: string }>
  >(
    Object.fromEntries(
      results.map((r) => [
        r.student_id,
        {
          marks_obtained: r.marks_obtained ?? undefined,
          status: r.status,
          feedback: r.feedback || '',
        },
      ])
    )
  );

  const handleMarksChange = (studentId: number, marks: number | undefined) => {
    setEditedResults((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        marks_obtained: marks,
        status: marks !== undefined ? 'graded' : prev[studentId].status,
      },
    }));
  };

  const handleStatusChange = (studentId: number, status: ExamResultStatus) => {
    setEditedResults((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        marks_obtained: status === 'absent' ? 0 : prev[studentId].marks_obtained,
      },
    }));
  };

  const handleFeedbackChange = (studentId: number, feedback: string) => {
    setEditedResults((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], feedback },
    }));
  };

  const handleSubmit = () => {
    const data = Object.entries(editedResults).map(([studentId, result]) => ({
      student_id: parseInt(studentId),
      marks_obtained: result.marks_obtained,
      status: result.status,
      feedback: result.feedback || undefined,
    }));
    onSave(data);
  };

  const getGrade = (marks: number | undefined): string => {
    if (marks === undefined) return '-';
    const percentage = (marks / exam.total_marks) * 100;
    if (percentage >= 95) return 'A+';
    if (percentage >= 90) return 'A';
    if (percentage >= 85) return 'B+';
    if (percentage >= 80) return 'B';
    if (percentage >= 75) return 'C+';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getGradeColor = (marks: number | undefined): string => {
    if (marks === undefined) return 'text-gray-500';
    const percentage = (marks / exam.total_marks) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const statusButtons = [
    { status: 'graded' as const, icon: CheckCircleIcon, label: 'تم التصحيح', color: 'green' },
    { status: 'pending' as const, icon: ClockIcon, label: 'معلق', color: 'yellow' },
    { status: 'absent' as const, icon: XCircleIcon, label: 'غائب', color: 'red' },
  ];

  if (results.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">لا يوجد طلاب</h3>
        <p className="mt-1 text-sm text-gray-500">لم يتم تسجيل نتائج بعد</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">الطالب</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">الدرجة</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">التقدير</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">الحالة</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">ملاحظات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map((result) => {
              const edited = editedResults[result.student_id];
              return (
                <tr key={result.student_id}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{result.student?.name}</div>
                    <div className="text-sm text-gray-500">{result.student?.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={edited?.marks_obtained ?? ''}
                      onChange={(e) =>
                        handleMarksChange(
                          result.student_id,
                          e.target.value ? parseFloat(e.target.value) : undefined
                        )
                      }
                      min={0}
                      max={exam.total_marks}
                      step="0.5"
                      disabled={edited?.status === 'absent'}
                      className="w-20 text-center rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm disabled:bg-gray-100"
                      placeholder={`/ ${exam.total_marks}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-lg font-bold ${getGradeColor(edited?.marks_obtained)}`}>
                      {edited?.status === 'absent' ? 'F' : getGrade(edited?.marks_obtained)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      {statusButtons.map((btn) => {
                        const isSelected = edited?.status === btn.status;
                        return (
                          <button
                            key={btn.status}
                            type="button"
                            onClick={() => handleStatusChange(result.student_id, btn.status)}
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
                      value={edited?.feedback || ''}
                      onChange={(e) => handleFeedbackChange(result.student_id, e.target.value)}
                      className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                      placeholder="ملاحظات..."
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50"
        >
          {isSaving ? 'جاري الحفظ...' : 'حفظ النتائج'}
        </button>
      </div>
    </div>
  );
}

export default ExamResultsTable;
