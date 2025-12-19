'use client';

import Link from 'next/link';
import { Student, StudentStatus } from '@/types/student';

interface StudentCardProps {
  student: Student;
  onDelete?: (id: number) => void;
}

const statusColors: Record<StudentStatus, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
};

const statusLabels: Record<StudentStatus, string> = {
  active: 'نشط',
  inactive: 'غير نشط',
  suspended: 'معلق',
};

export function StudentCard({ student, onDelete }: StudentCardProps) {
  const status = student.profile?.status || 'active';

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-blue-600 font-bold text-xl">
                  {student.name.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div className="mr-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {student.name}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}
              >
                {statusLabels[status]}
              </span>
            </div>
            <p className="text-sm text-gray-500">{student.phone}</p>
            {student.email && (
              <p className="text-sm text-gray-500">{student.email}</p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">المرحلة الدراسية</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {student.profile?.grade_level || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">المدرسة</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {student.profile?.school_name || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">تاريخ التسجيل</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {student.profile?.enrollment_date
                  ? new Date(student.profile.enrollment_date).toLocaleDateString('ar-EG')
                  : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">الجنس</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {student.gender === 'male' ? 'ذكر' : student.gender === 'female' ? 'أنثى' : '-'}
              </dd>
            </div>
          </dl>
        </div>

        {student.profile?.parent && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">ولي الأمر</h4>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-600 font-medium text-xs">
                  {student.profile.parent.name.charAt(0)}
                </span>
              </div>
              <div className="mr-2">
                <p className="text-sm font-medium text-gray-900">
                  {student.profile.parent.name}
                </p>
                <p className="text-xs text-gray-500">
                  {student.profile.parent.phone}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Link
            href={`/dashboard/students/${student.id}`}
            className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            عرض التفاصيل
          </Link>
          <Link
            href={`/dashboard/students/${student.id}/edit`}
            className="flex-1 text-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            تعديل
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(student.id)}
              className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
            >
              حذف
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
