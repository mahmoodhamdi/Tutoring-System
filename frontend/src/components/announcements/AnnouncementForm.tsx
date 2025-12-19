'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Announcement, CreateAnnouncementData, PRIORITY_LABELS, TYPE_LABELS } from '@/types/announcement';
import { useGroups } from '@/hooks/useGroups';

const announcementSchema = z.object({
  group_id: z.number().optional().nullable(),
  title: z.string().min(1, 'عنوان الإعلان مطلوب'),
  content: z.string().min(1, 'محتوى الإعلان مطلوب'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']),
  type: z.enum(['general', 'schedule', 'exam', 'payment', 'event']),
  is_pinned: z.boolean().optional(),
  expires_at: z.string().optional(),
  publish: z.boolean().optional(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  announcement?: Announcement;
  onSubmit: (data: CreateAnnouncementData) => void;
  isSubmitting?: boolean;
}

export function AnnouncementForm({ announcement, onSubmit, isSubmitting }: AnnouncementFormProps) {
  const { data: groupsData } = useGroups();
  const groups = groupsData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      group_id: announcement?.group_id || undefined,
      title: announcement?.title || '',
      content: announcement?.content || '',
      priority: announcement?.priority || 'normal',
      type: announcement?.type || 'general',
      is_pinned: announcement?.is_pinned || false,
      expires_at: announcement?.expires_at?.slice(0, 16) || '',
      publish: false,
    },
  });

  const handleFormSubmit = (data: AnnouncementFormData) => {
    onSubmit({
      ...data,
      group_id: data.group_id || undefined,
      expires_at: data.expires_at || undefined,
    } as CreateAnnouncementData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات الإعلان</h3>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              العنوان *
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="عنوان الإعلان"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              المحتوى *
            </label>
            <textarea
              id="content"
              {...register('content')}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="محتوى الإعلان..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Group */}
            <div>
              <label htmlFor="group_id" className="block text-sm font-medium text-gray-700 mb-1">
                المجموعة
              </label>
              <select
                id="group_id"
                {...register('group_id', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">للجميع</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                الأولوية *
              </label>
              <select
                id="priority"
                {...register('priority')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                النوع *
              </label>
              <select
                id="type"
                {...register('type')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Expires At */}
          <div>
            <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 mb-1">
              تاريخ الانتهاء (اختياري)
            </label>
            <input
              type="datetime-local"
              id="expires_at"
              {...register('expires_at')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Pinned */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_pinned"
              {...register('is_pinned')}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="is_pinned" className="text-sm text-gray-700">
              تثبيت الإعلان في الأعلى
            </label>
          </div>

          {/* Publish immediately (only for new announcements) */}
          {!announcement && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="publish"
                {...register('publish')}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="publish" className="text-sm text-gray-700">
                نشر الإعلان فوراً
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'جاري الحفظ...' : announcement ? 'تحديث الإعلان' : 'إنشاء الإعلان'}
        </button>
      </div>
    </form>
  );
}
