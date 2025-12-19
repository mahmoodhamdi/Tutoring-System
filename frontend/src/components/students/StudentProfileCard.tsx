'use client';

import { Student, StudentStatus } from '@/types/student';

interface StudentProfileCardProps {
  student: Student;
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

export function StudentProfileCard({ student }: StudentProfileCardProps) {
  const status = student.profile?.status || 'active';

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-blue-600 font-bold text-3xl">
                  {student.name.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div className="mr-6">
            <h2 className="text-2xl font-bold text-white">{student.name}</h2>
            <p className="text-blue-100">{student.phone}</p>
            {student.email && <p className="text-blue-100">{student.email}</p>}
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
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              المعلومات الشخصية
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">تاريخ الميلاد</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {student.date_of_birth
                    ? new Date(student.date_of_birth).toLocaleDateString('ar-EG')
                    : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">الجنس</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {student.gender === 'male'
                    ? 'ذكر'
                    : student.gender === 'female'
                    ? 'أنثى'
                    : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">حالة الحساب</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {student.is_active ? (
                    <span className="text-green-600">نشط</span>
                  ) : (
                    <span className="text-red-600">غير نشط</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Academic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              المعلومات الأكاديمية
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">المرحلة الدراسية</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {student.profile?.grade_level || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">المدرسة</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {student.profile?.school_name || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">تاريخ التسجيل</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {student.profile?.enrollment_date
                    ? new Date(student.profile.enrollment_date).toLocaleDateString(
                        'ar-EG'
                      )
                    : '-'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              معلومات الاتصال
            </h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">العنوان</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {student.profile?.address || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">جهة الاتصال الطارئة</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {student.profile?.emergency_contact_name || '-'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">هاتف الطوارئ</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {student.profile?.emergency_contact_phone || '-'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Parent Info */}
        {student.profile?.parent && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ولي الأمر</h3>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-bold text-lg">
                  {student.profile.parent.name.charAt(0)}
                </span>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-900">
                  {student.profile.parent.name}
                </p>
                <p className="text-sm text-gray-500">
                  {student.profile.parent.phone}
                </p>
                {student.profile.parent.email && (
                  <p className="text-sm text-gray-500">
                    {student.profile.parent.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {student.profile?.notes && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ملاحظات</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
              {student.profile.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
