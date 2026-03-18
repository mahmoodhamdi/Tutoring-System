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
    if (marks === undefined) return 'text-neutral-500';
    const percentage = (marks / exam.total_marks) * 100;
    if (percentage >= 90) return 'text-success-600';
    if (percentage >= 80) return 'text-primary-600';
    if (percentage >= 70) return 'text-accent-600';
    if (percentage >= 60) return 'text-accent-500';
    return 'text-error-600';
  };

  const statusConfig = [
    { status: 'graded' as const, icon: CheckCircleIcon, label: 'تم التصحيح', selectedClass: 'bg-success-100 text-success-700 ring-2 ring-success-400', hoverClass: 'hover:bg-success-50 hover:text-success-600' },
    { status: 'pending' as const, icon: ClockIcon, label: 'معلق', selectedClass: 'bg-accent-100 text-accent-700 ring-2 ring-accent-400', hoverClass: 'hover:bg-accent-50 hover:text-accent-600' },
    { status: 'absent' as const, icon: XCircleIcon, label: 'غائب', selectedClass: 'bg-error-100 text-error-700 ring-2 ring-error-400', hoverClass: 'hover:bg-error-50 hover:text-error-600' },
  ];

  if (results.length === 0) {
    return (
      <div className="text-center py-14 bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <div className="h-14 w-14 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
          <UserIcon className="h-7 w-7 text-neutral-400" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-neutral-900">لا يوجد طلاب</h3>
        <p className="mt-1 text-sm text-neutral-500">لم يتم تسجيل نتائج بعد</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-100">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">الطالب</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider">الدرجة</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider">التقدير</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider">الحالة</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider">ملاحظات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {results.map((result, idx) => {
              const edited = editedResults[result.student_id];
              return (
                <tr key={result.student_id} className={idx % 2 === 1 ? 'bg-neutral-50/50' : 'bg-white'}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-neutral-900">{result.student?.name}</div>
                    <div className="text-sm text-neutral-500">{result.student?.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
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
                      className="w-20 text-center rounded-xl border border-neutral-200 py-1 px-2 text-neutral-800 text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all disabled:bg-neutral-100 disabled:text-neutral-400"
                      placeholder={`/ ${exam.total_marks}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-lg font-extrabold ${getGradeColor(edited?.marks_obtained)}`}>
                      {edited?.status === 'absent' ? 'F' : getGrade(edited?.marks_obtained)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1.5">
                      {statusConfig.map((btn) => {
                        const isSelected = edited?.status === btn.status;
                        return (
                          <button
                            key={btn.status}
                            type="button"
                            onClick={() => handleStatusChange(result.student_id, btn.status)}
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
                      value={edited?.feedback || ''}
                      onChange={(e) => handleFeedbackChange(result.student_id, e.target.value)}
                      className="block w-full rounded-xl border border-neutral-200 py-1.5 px-3 text-neutral-800 text-sm shadow-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all"
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
          className="rounded-xl bg-gradient-to-l from-primary-600 to-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:from-primary-700 hover:to-primary-600 transition-all duration-200 disabled:opacity-50"
        >
          {isSaving ? 'جاري الحفظ...' : 'حفظ النتائج'}
        </button>
      </div>
    </div>
  );
}

export default ExamResultsTable;
