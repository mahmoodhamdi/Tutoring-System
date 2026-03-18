'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuizzes, usePublishQuiz, useUnpublishQuiz, useDuplicateQuiz, useDeleteQuiz } from '@/hooks/useQuizzes';
import { useGroups } from '@/hooks/useGroups';
import { QuizCard } from '@/components/quizzes';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function QuizzesPage() {
  const [filters, setFilters] = useState({
    group_id: undefined as number | undefined,
    is_published: undefined as boolean | undefined,
    search: '',
  });

  const { data: quizzesData, isLoading } = useQuizzes(filters);
  const { data: groupsData } = useGroups();

  const publishQuiz = usePublishQuiz();
  const unpublishQuiz = useUnpublishQuiz();
  const duplicateQuiz = useDuplicateQuiz();
  const deleteQuiz = useDeleteQuiz();

  const quizzes = quizzesData?.data || [];
  const groups = groupsData?.data || [];

  const handlePublish = async (id: number) => {
    try {
      await publishQuiz.mutateAsync(id);
    } catch {
      // handled by global mutation error handler
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await unpublishQuiz.mutateAsync(id);
    } catch {
      // handled by global mutation error handler
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await duplicateQuiz.mutateAsync(id);
    } catch {
      // handled by global mutation error handler
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الاختبار؟')) return;
    try {
      await deleteQuiz.mutateAsync(id);
    } catch {
      // handled by global mutation error handler
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">الاختبارات القصيرة</h1>
          <p className="text-neutral-500">إدارة الاختبارات والكويزات</p>
        </div>
        <Link
          href="/dashboard/quizzes/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-semibold transition-colors shadow-sm"
        >
          <PlusIcon className="w-5 h-5" />
          اختبار جديد
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="بحث..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pr-10 pl-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>

          {/* Group Filter */}
          <select
            value={filters.group_id || ''}
            onChange={(e) => setFilters({ ...filters, group_id: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="">جميع المجموعات</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.is_published === undefined ? '' : filters.is_published ? 'published' : 'draft'}
            onChange={(e) => {
              const value = e.target.value;
              setFilters({
                ...filters,
                is_published: value === '' ? undefined : value === 'published',
              });
            }}
            className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="">جميع الحالات</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => setFilters({ group_id: undefined, is_published: undefined, search: '' })}
            className="px-4 py-2 text-neutral-600 bg-neutral-100 rounded-xl hover:bg-neutral-200 font-semibold text-sm transition-colors"
          >
            إعادة تعيين
          </button>
        </div>
      </div>

      {/* Quizzes List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full mx-auto animate-spin"></div>
          <p className="text-neutral-500 mt-4">جاري التحميل...</p>
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
          <p className="text-neutral-500 mb-4">لا توجد اختبارات</p>
          <Link
            href="/dashboard/quizzes/new"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <PlusIcon className="w-5 h-5" />
            إنشاء اختبار جديد
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
