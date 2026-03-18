'use client';

import Image from 'next/image';
import { Student, StudentStatus } from '@/types/student';

interface StudentProfileCardProps {
  student: Student;
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

export function StudentProfileCard({ student }: StudentProfileCardProps) {
  const status = student.profile?.status || 'active';

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-l from-primary-700 to-primary-500 px-6 py-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full bg-white/20 ring-4 ring-white/30 flex items-center justify-center">
              {student.avatar ? (
                <Image
                  src={student.avatar}
                  alt={student.name}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-white font-extrabold text-3xl">
                  {student.name.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div className="mr-6">
            <h2 className="text-2xl font-extrabold text-white">{student.name}</h2>
            <p className="text-primary-100 mt-0.5">{student.phone}</p>
            {student.email && <p className="text-primary-100 text-sm">{student.email}</p>}
          </div>
          <div className="mr-auto">
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[status]}`}
            >
              {statusLabels[status]}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-2">
              المعلومات الشخصية
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide">تاريخ الميلاد</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-800">
                  {student.date_of_birth
                    ? new Date(student.date_of_birth).toLocaleDateString('ar-EG')
                    : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide">الجنس</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-800">
                  {student.gender === 'male'
                    ? 'ذكر'
                    : student.gender === 'female'
                    ? 'أنثى'
                    : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide">حالة الحساب</dt>
                <dd className="mt-1 text-sm font-medium">
                  {student.is_active ? (
                    <span className="text-success-600">نشط</span>
                  ) : (
                    <span className="text-error-600">غير نشط</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Academic Info */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-2">
              المعلومات الأكاديمية
            </h3>
            <dl className="space-y-3">
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
            </dl>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-2">
              معلومات الاتصال
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide">العنوان</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-800">
                  {student.profile?.address || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide">جهة الاتصال الطارئة</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-800">
                  {student.profile?.emergency_contact_name || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide">هاتف الطوارئ</dt>
                <dd className="mt-1 text-sm font-medium text-neutral-800">
                  {student.profile?.emergency_contact_phone || '-'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Parent Info */}
        {student.profile?.parent && (
          <div className="mt-6 pt-6 border-t border-neutral-100">
            <h3 className="text-base font-bold text-neutral-900 mb-4">ولي الأمر</h3>
            <div className="flex items-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <div className="h-12 w-12 rounded-full bg-secondary-100 flex items-center justify-center">
                <span className="text-secondary-600 font-bold text-lg">
                  {student.profile.parent.name.charAt(0)}
                </span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-semibold text-neutral-900">
                  {student.profile.parent.name}
                </p>
                <p className="text-sm text-neutral-500">
                  {student.profile.parent.phone}
                </p>
                {student.profile.parent.email && (
                  <p className="text-sm text-neutral-500">
                    {student.profile.parent.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {student.profile?.notes && (
          <div className="mt-6 pt-6 border-t border-neutral-100">
            <h3 className="text-base font-bold text-neutral-900 mb-4">ملاحظات</h3>
            <p className="text-sm text-neutral-700 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              {student.profile.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
