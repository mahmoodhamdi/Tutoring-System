'use client';

import Link from 'next/link';
import { Group } from '@/types/group';
import {
  UserGroupIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface GroupsTableProps {
  groups: Group[];
  onDelete?: (group: Group) => void;
  isDeleting?: boolean;
}

export function GroupsTable({ groups, onDelete, isDeleting }: GroupsTableProps) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">لا توجد مجموعات</h3>
        <p className="mt-1 text-sm text-gray-500">ابدأ بإنشاء مجموعة جديدة</p>
        <div className="mt-6">
          <Link
            href="/dashboard/groups/new"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500"
          >
            إنشاء مجموعة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pr-4 pl-3 text-right text-sm font-semibold text-gray-900"
            >
              اسم المجموعة
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
            >
              المادة
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
            >
              المرحلة الدراسية
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
            >
              الطلاب
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
            >
              الرسوم الشهرية
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
            >
              الحالة
            </th>
            <th scope="col" className="relative py-3.5 pr-3 pl-4">
              <span className="sr-only">إجراءات</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {groups.map((group) => (
            <tr key={group.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap py-4 pr-4 pl-3 text-sm font-medium text-gray-900">
                {group.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {group.subject || '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {group.grade_level || '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span className="inline-flex items-center">
                  <UserGroupIcon className="h-4 w-4 ml-1" />
                  {group.student_count} / {group.max_students}
                </span>
                {group.available_spots === 0 && (
                  <span className="mr-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                    مكتملة
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {group.monthly_fee.toLocaleString('ar-EG')} ج.م
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    group.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {group.is_active ? 'نشطة' : 'غير نشطة'}
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pr-3 pl-4 text-left text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/groups/${group.id}`}
                    className="text-gray-600 hover:text-gray-900"
                    title="عرض"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/dashboard/groups/${group.id}/edit`}
                    className="text-primary-600 hover:text-primary-900"
                    title="تعديل"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </Link>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(group)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      title="حذف"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GroupsTable;
