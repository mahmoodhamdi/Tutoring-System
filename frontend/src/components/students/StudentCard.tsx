'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Student, StudentStatus } from '@/types/student';

interface StudentCardProps {
  student: Student;
  onDelete?: (id: number) => void;
}

const statusColors: Record<StudentStatus, string> = {
  active: 'bg-success-100 text-success-700',
  inactive: 'bg-neutral-100 text-neutral-600',
  suspended: 'bg-error-100 text-error-700',
};

const statusLabels: Record<StudentStatus, string> = {
  active: 'نشط',
  inactive: 'غير نشط',
  suspended: 'معلق',
};

export function StudentCard({ student, onDelete }: StudentCardProps) {
  const status = student.profile?.status || 'active';

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-primary-200">
              {student.avatar ? (
                <Image
                  src={student.avatar}
                  alt={student.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-primary-600 font-bold text-xl">
                  {student.name.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div className="mr-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">
                {student.name}
              </h3>
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}
              >
                {statusLabels[status]}
              </span>
            </div>
            <p className="text-sm text-neutral-500 mt-0.5">{student.phone}</p>
            {student.email && (
              <p className="text-sm text-neutral-500">{student.email}</p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-neutral-100 pt-4">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide">المرحلة الدراسية</dt>
              <dd className="mt-1 text-sm font-medium text-neutral-800">
                {student.profile?.grade_level || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide">المدرسة</dt>
              <dd className="mt-1 text-sm font-medium text-neutral-800">
                {student.profile?.school_name || '-'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide">تاريخ التسجيل</dt>
              <dd className="mt-1 text-sm font-medium text-neutral-800">
                {student.profile?.enrollment_date
                  ? new Date(student.profile.enrollment_date).toLocaleDateString('ar-EG')
                  : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide">الجنس</dt>
              <dd className="mt-1 text-sm font-medium text-neutral-800">
                {student.gender === 'male' ? 'ذكر' : student.gender === 'female' ? 'أنثى' : '-'}
              </dd>
            </div>
          </dl>
        </div>

        {student.profile?.parent && (
          <div className="mt-4 border-t border-neutral-100 pt-4">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">ولي الأمر</h4>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-secondary-100 flex items-center justify-center">
                <span className="text-secondary-600 font-semibold text-xs">
                  {student.profile.parent.name.charAt(0)}
                </span>
              </div>
              <div className="mr-2">
                <p className="text-sm font-semibold text-neutral-800">
                  {student.profile.parent.name}
                </p>
                <p className="text-xs text-neutral-500">
                  {student.profile.parent.phone}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-2">
          <Link
            href={`/dashboard/students/${student.id}`}
            className="flex-1 text-center px-4 py-2 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-all duration-200"
          >
            عرض التفاصيل
          </Link>
          <Link
            href={`/dashboard/students/${student.id}/edit`}
            className="flex-1 text-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-l from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-sm"
          >
            تعديل
          </Link>
          {onDelete && (
            <button
              onClick={() => onDelete(student.id)}
              className="px-4 py-2 border border-error-200 rounded-xl text-sm font-medium text-error-600 hover:bg-error-50 transition-all duration-200"
            >
              حذف
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
