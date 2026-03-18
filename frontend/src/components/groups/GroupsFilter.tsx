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

const selectClass =
  'mt-1 block w-full rounded-xl border border-neutral-200 bg-white py-2 pr-3 pl-3 text-sm text-neutral-800 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200';

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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-xl border border-neutral-200 bg-white py-2 pr-10 pl-3 text-neutral-800 text-sm shadow-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200"
            placeholder="البحث في المجموعات..."
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-x-1.5 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm border transition-all duration-200 ${
            hasActiveFilters
              ? 'bg-primary-50 text-primary-700 border-primary-300 hover:bg-primary-100'
              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <FunnelIcon className="h-4 w-4" />
          تصفية
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-600 rounded-full">
              !
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="filter-subject" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                المادة
              </label>
              <select
                id="filter-subject"
                value={filters.subject || ''}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className={selectClass}
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
              <label htmlFor="filter-grade" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                المرحلة الدراسية
              </label>
              <select
                id="filter-grade"
                value={filters.grade_level || ''}
                onChange={(e) => handleGradeLevelChange(e.target.value)}
                className={selectClass}
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
              <label htmlFor="filter-active" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                الحالة
              </label>
              <select
                id="filter-active"
                value={filters.is_active === undefined ? '' : String(filters.is_active)}
                onChange={(e) => handleActiveChange(e.target.value)}
                className={selectClass}
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
                className="inline-flex items-center gap-x-1 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
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
