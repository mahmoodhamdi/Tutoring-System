'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useGroup,
  useGroupStudents,
  useAddStudentsToGroup,
  useRemoveStudentFromGroup,
  useDeleteGroup,
} from '@/hooks/useGroups';
import { GroupStudentsList, AddStudentsModal } from '@/components/groups';
import {
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  UserGroupIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = Number(params.id);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [includeInactive, setIncludeInactive] = useState(false);

  const { data: groupData, isLoading: isLoadingGroup, error } = useGroup(groupId);
  const { data: studentsData, isLoading: isLoadingStudents } = useGroupStudents(groupId, {
    include_inactive: includeInactive,
  });

  const addStudents = useAddStudentsToGroup();
  const removeStudent = useRemoveStudentFromGroup();
  const deleteGroup = useDeleteGroup();

  const group = groupData?.data;
  const students = studentsData?.data || [];

  const handleAddStudents = async (studentIds: number[], joinedAt?: string) => {
    await addStudents.mutateAsync({
      groupId,
      data: { student_ids: studentIds, joined_at: joinedAt },
    });
    setIsAddModalOpen(false);
  };

  const handleRemoveStudent = async (studentId: number) => {
    if (confirm('هل أنت متأكد من إزالة هذا الطالب من المجموعة؟')) {
      await removeStudent.mutateAsync({ groupId, studentId });
    }
  };

  const handleDelete = async () => {
    if (group?.student_count && group.student_count > 0) {
      alert('لا يمكن حذف المجموعة لأنها تحتوي على طلاب نشطين');
      return;
    }
    if (confirm(`هل أنت متأكد من حذف المجموعة "${group?.name}"؟`)) {
      await deleteGroup.mutateAsync(groupId);
      router.push('/dashboard/groups');
    }
  };

  if (isLoadingGroup) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">حدث خطأ أثناء تحميل بيانات المجموعة</p>
        <Link href="/dashboard/groups" className="mt-4 text-primary-600 hover:underline">
          العودة للمجموعات
        </Link>
      </div>
    );
  }

  const capacityPercentage = (group.student_count / group.max_students) * 100;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/dashboard/groups"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowRightIcon className="h-4 w-4 ml-1" />
          العودة للمجموعات
        </Link>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">{group.name}</h1>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    group.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {group.is_active ? 'نشطة' : 'غير نشطة'}
                </span>
              </div>
              {group.description && (
                <p className="mt-2 text-sm text-gray-600">{group.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/groups/${group.id}/edit`}
                className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PencilSquareIcon className="h-5 w-5 ml-1" />
                تعديل
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteGroup.isPending}
                className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 disabled:opacity-50"
              >
                <TrashIcon className="h-5 w-5 ml-1" />
                حذف
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                <span className="mr-3 text-sm font-medium text-gray-500">المادة</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {group.subject || 'غير محدد'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <CalendarIcon className="h-6 w-6 text-gray-400" />
                <span className="mr-3 text-sm font-medium text-gray-500">المرحلة</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {group.grade_level || 'غير محدد'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
                <span className="mr-3 text-sm font-medium text-gray-500">الطلاب</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {group.student_count} / {group.max_students}
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    capacityPercentage >= 90
                      ? 'bg-red-500'
                      : capacityPercentage >= 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                <span className="mr-3 text-sm font-medium text-gray-500">الرسوم</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {group.monthly_fee.toLocaleString('ar-EG')} ج.م / شهر
              </p>
            </div>
          </div>

          {group.schedule_description && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">الجدول:</span> {group.schedule_description}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">الطلاب</h2>
              <p className="text-sm text-gray-500">
                {group.student_count} طالب نشط من أصل {group.max_students}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={includeInactive}
                  onChange={(e) => setIncludeInactive(e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                عرض الطلاب غير النشطين
              </label>
              {group.available_spots > 0 && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
                >
                  <UserPlusIcon className="h-5 w-5 ml-1" />
                  إضافة طلاب
                </button>
              )}
            </div>
          </div>

          {isLoadingStudents ? (
            <div className="text-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary-600 border-r-transparent"></div>
            </div>
          ) : (
            <GroupStudentsList
              students={students}
              onRemove={handleRemoveStudent}
              isRemoving={removeStudent.isPending}
              showInactive={includeInactive}
            />
          )}
        </div>
      </div>

      <AddStudentsModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStudents}
        existingStudentIds={students.filter((s) => s.pivot.is_active).map((s) => s.id)}
        isAdding={addStudents.isPending}
        maxStudents={group.max_students}
        currentCount={group.student_count}
      />
    </div>
  );
}
