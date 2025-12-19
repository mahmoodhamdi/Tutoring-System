'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StudentStatus } from '@/types/student';

interface StudentsFilterProps {
  onSearch: (search: string) => void;
  onFilter: (filters: {
    status?: StudentStatus;
    grade_level?: string;
    is_active?: boolean;
  }) => void;
  initialSearch?: string;
  initialFilters?: {
    status?: StudentStatus;
    grade_level?: string;
    is_active?: boolean;
  };
}

const gradeLevels = [
  'الصف الأول',
  'الصف الثاني',
  'الصف الثالث',
  'الصف الرابع',
  'الصف الخامس',
  'الصف السادس',
  'الصف السابع',
  'الصف الثامن',
  'الصف التاسع',
  'الصف العاشر',
  'الصف الحادي عشر',
  'الصف الثاني عشر',
];

export function StudentsFilter({
  onSearch,
  onFilter,
  initialSearch = '',
  initialFilters = {},
}: StudentsFilterProps) {
  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState<StudentStatus | ''>(
    initialFilters.status || ''
  );
  const [gradeLevel, setGradeLevel] = useState(initialFilters.grade_level || '');
  const [isActive, setIsActive] = useState<boolean | undefined>(
    initialFilters.is_active
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, onSearch]);

  const handleFilterChange = () => {
    onFilter({
      status: status || undefined,
      grade_level: gradeLevel || undefined,
      is_active: isActive,
    });
  };

  const handleClearFilters = () => {
    setStatus('');
    setGradeLevel('');
    setIsActive(undefined);
    onFilter({});
  };

  const hasActiveFilters = status || gradeLevel || isActive !== undefined;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              type="text"
              placeholder="ابحث بالاسم أو رقم الهاتف أو البريد..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm font-medium ${
            hasActiveFilters
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>تصفية</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
              {[status, gradeLevel, isActive !== undefined].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الحالة
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StudentStatus | '')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">الكل</option>
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="suspended">معلق</option>
              </select>
            </div>

            {/* Grade Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المرحلة الدراسية
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">الكل</option>
                {gradeLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Account Active Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حالة الحساب
              </label>
              <select
                value={isActive === undefined ? '' : isActive.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  setIsActive(value === '' ? undefined : value === 'true');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">الكل</option>
                <option value="true">نشط</option>
                <option value="false">غير نشط</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              مسح الفلاتر
            </Button>
            <Button type="button" onClick={handleFilterChange}>
              تطبيق
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
