'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGroups, useDeleteGroup } from '@/hooks/useGroups';
import { GroupsTable, GroupsFilter } from '@/components/groups';
import { GroupListParams, Group } from '@/types/group';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function GroupsPage() {
  const [filters, setFilters] = useState<GroupListParams>({ page: 1 });

  const { data, isLoading, error } = useGroups(filters);
  const deleteGroup = useDeleteGroup();

  const handleDeleteClick = (group: Group) => {
    if (group.student_count > 0) {
      alert('لا يمكن حذف المجموعة لأنها تحتوي على طلاب نشطين');
      return;
    }
    if (confirm(`هل أنت متأكد من حذف المجموعة "${group.name}"؟`)) {
      deleteGroup.mutate(group.id);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error-600">حدث خطأ أثناء تحميل المجموعات</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-extrabold text-neutral-900">المجموعات</h1>
          <p className="mt-2 text-sm text-neutral-600">
            إدارة المجموعات الدراسية والطلاب المسجلين فيها
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:mr-auto">
          <Link
            href="/dashboard/groups/new"
            className="inline-flex items-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5 ml-1" />
            إضافة مجموعة
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <GroupsFilter filters={filters} onFilterChange={setFilters} />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600"></div>
            <p className="mt-2 text-neutral-500">جاري التحميل...</p>
          </div>
        ) : (
          <>
            <GroupsTable
              groups={data?.data || []}
              onDelete={handleDeleteClick}
              isDeleting={deleteGroup.isPending}
            />

            {data && data.meta.last_page > 1 && (
              <nav className="mt-6 flex items-center justify-between border-t border-neutral-200 px-4 sm:px-0">
                <div className="flex w-0 flex-1">
                  <button
                    onClick={() => handlePageChange(data.meta.current_page - 1)}
                    disabled={data.meta.current_page === 1}
                    className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 disabled:opacity-50 transition-colors"
                  >
                    السابق
                  </button>
                </div>
                <div className="hidden md:flex">
                  <span className="inline-flex items-center border-t-2 border-primary-500 px-4 pt-4 text-sm font-semibold text-primary-600">
                    صفحة {data.meta.current_page} من {data.meta.last_page}
                  </span>
                </div>
                <div className="flex w-0 flex-1 justify-end">
                  <button
                    onClick={() => handlePageChange(data.meta.current_page + 1)}
                    disabled={data.meta.current_page === data.meta.last_page}
                    className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 disabled:opacity-50 transition-colors"
                  >
                    التالي
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
