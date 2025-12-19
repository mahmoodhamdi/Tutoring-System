'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { GroupListParams } from '@/types/group';

interface GroupsFilterProps {
  filters: GroupListParams;
  onFilterChange: (filters: GroupListParams) => void;
}

const SUBJECTS = [
  'الرياضيات',
  'اللغة العربية',
  'اللغة الإنجليزية',
  'العلوم',
  'الفيزياء',
  'الكيمياء',
  'الأحياء',
  'التاريخ',
  'الجغرافيا',
];

const GRADE_LEVELS = [
  'الصف الأول الابتدائي',
  'الصف الثاني الابتدائي',
  'الصف الثالث الابتدائي',
  'الصف الرابع الابتدائي',
  'الصف الخامس الابتدائي',
  'الصف السادس الابتدائي',
  'الصف الأول الإعدادي',
  'الصف الثاني الإعدادي',
  'الصف الثالث الإعدادي',
  'الصف الأول الثانوي',
  'الصف الثاني الثانوي',
  'الصف الثالث الثانوي',
];

export function GroupsFilter({ filters, onFilterChange }: GroupsFilterProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search !== filters.search) {
        onFilterChange({ ...filters, search: search || undefined, page: 1 });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, filters, onFilterChange]);

  const handleSubjectChange = (subject: string) => {
    onFilterChange({ ...filters, subject: subject || undefined, page: 1 });
  };

  const handleGradeLevelChange = (gradeLevel: string) => {
    onFilterChange({ ...filters, grade_level: gradeLevel || undefined, page: 1 });
  };

  const handleActiveChange = (value: string) => {
    let isActive: boolean | undefined;
    if (value === 'true') isActive = true;
    else if (value === 'false') isActive = false;
    onFilterChange({ ...filters, is_active: isActive, page: 1 });
  };

  const clearFilters = () => {
    setSearch('');
    onFilterChange({ page: 1 });
  };

  const hasActiveFilters =
    filters.search || filters.subject || filters.grade_level || filters.is_active !== undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            placeholder="البحث في المجموعات..."
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ${
            hasActiveFilters
              ? 'bg-primary-50 text-primary-700 ring-primary-300'
              : 'bg-white text-gray-900 ring-gray-300 hover:bg-gray-50'
          }`}
        >
          <FunnelIcon className="h-5 w-5" />
          تصفية
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-600 rounded-full">
              !
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="filter-subject" className="block text-sm font-medium text-gray-700">
                المادة
              </label>
              <select
                id="filter-subject"
                value={filters.subject || ''}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-3 pl-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
              >
                <option value="">الكل</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-grade" className="block text-sm font-medium text-gray-700">
                المرحلة الدراسية
              </label>
              <select
                id="filter-grade"
                value={filters.grade_level || ''}
                onChange={(e) => handleGradeLevelChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-3 pl-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
              >
                <option value="">الكل</option>
                {GRADE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="filter-active" className="block text-sm font-medium text-gray-700">
                الحالة
              </label>
              <select
                id="filter-active"
                value={filters.is_active === undefined ? '' : String(filters.is_active)}
                onChange={(e) => handleActiveChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-3 pl-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
              >
                <option value="">الكل</option>
                <option value="true">نشطة</option>
                <option value="false">غير نشطة</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-x-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <XMarkIcon className="h-4 w-4" />
                مسح التصفية
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GroupsFilter;
