'use client';

import { GroupStudent } from '@/types/group';
import { UserMinusIcon, UserIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

interface GroupStudentsListProps {
  students: GroupStudent[];
  onRemove?: (studentId: number) => void;
  isRemoving?: boolean;
  showInactive?: boolean;
}

export function GroupStudentsList({
  students,
  onRemove,
  isRemoving,
  showInactive,
}: GroupStudentsListProps) {
  if (students.length === 0) {
    return (
      <div className="text-center py-8">
        <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">لا يوجد طلاب</h3>
        <p className="mt-1 text-sm text-gray-500">
          {showInactive ? 'لم يتم تسجيل أي طلاب في هذه المجموعة' : 'لا يوجد طلاب نشطين في هذه المجموعة'}
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {students.map((student) => (
        <li key={student.id} className="flex items-center justify-between gap-x-6 py-4">
          <div className="flex items-center gap-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <span className="text-sm font-medium">
                {student.name?.charAt(0) || '?'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{student.name}</p>
              <div className="flex items-center gap-x-4 text-xs text-gray-500">
                <span>{student.phone}</span>
                {student.pivot.joined_at && (
                  <span>
                    انضم في{' '}
                    {format(new Date(student.pivot.joined_at), 'd MMMM yyyy', { locale: arSA })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-x-4">
            {!student.pivot.is_active && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                غير نشط
              </span>
            )}
            {student.pivot.left_at && (
              <span className="text-xs text-gray-500">
                غادر في{' '}
                {format(new Date(student.pivot.left_at), 'd MMMM yyyy', { locale: arSA })}
              </span>
            )}
            {onRemove && student.pivot.is_active && (
              <button
                onClick={() => onRemove(student.id)}
                disabled={isRemoving}
                className="rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100 disabled:opacity-50"
                title="إزالة من المجموعة"
              >
                <UserMinusIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default GroupStudentsList;
