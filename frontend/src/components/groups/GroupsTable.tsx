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
      <div className="text-center py-14">
        <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto">
          <UserGroupIcon className="h-8 w-8 text-neutral-400" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-neutral-900">لا توجد مجموعات</h3>
        <p className="mt-1 text-sm text-neutral-500">ابدأ بإنشاء مجموعة جديدة</p>
        <div className="mt-6">
          <Link
            href="/dashboard/groups/new"
            className="inline-flex items-center rounded-xl bg-gradient-to-l from-primary-600 to-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-primary-700 hover:to-primary-600 transition-all duration-200"
          >
            إنشاء مجموعة
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100 shadow-sm">
      <table className="min-w-full divide-y divide-neutral-100">
        <thead className="bg-neutral-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pr-4 pl-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider"
            >
              اسم المجموعة
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider"
            >
              المادة
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider"
            >
              المرحلة الدراسية
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider"
            >
              الطلاب
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider"
            >
              الرسوم الشهرية
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wider"
            >
              الحالة
            </th>
            <th scope="col" className="relative py-3.5 pr-3 pl-4">
              <span className="sr-only">إجراءات</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 bg-white">
          {groups.map((group, idx) => (
            <tr
              key={group.id}
              className={`hover:bg-neutral-50 transition-colors ${idx % 2 === 1 ? 'bg-neutral-50/50' : ''}`}
            >
              <td className="whitespace-nowrap py-4 pr-4 pl-3 text-sm font-semibold text-neutral-900">
                {group.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-600">
                {group.subject || '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-600">
                {group.grade_level || '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-600">
                <span className="inline-flex items-center">
                  <UserGroupIcon className="h-4 w-4 ml-1 text-neutral-400" />
                  {group.student_count} / {group.max_students}
                </span>
                {group.available_spots === 0 && (
                  <span className="mr-2 inline-flex items-center rounded-full bg-error-100 px-2 py-0.5 text-xs font-semibold text-error-700">
                    مكتملة
                  </span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-neutral-800">
                {group.monthly_fee.toLocaleString('ar-EG')} ج.م
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    group.is_active
                      ? 'bg-success-100 text-success-700'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {group.is_active ? 'نشطة' : 'غير نشطة'}
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pr-3 pl-4 text-left text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/groups/${group.id}`}
                    className="p-1.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all duration-200"
                    title="عرض"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/dashboard/groups/${group.id}/edit`}
                    className="p-1.5 text-primary-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200"
                    title="تعديل"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                  </Link>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(group)}
                      disabled={isDeleting}
                      className="p-1.5 text-error-500 hover:text-error-700 hover:bg-error-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="حذف"
                    >
                      <TrashIcon className="h-4 w-4" />
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
