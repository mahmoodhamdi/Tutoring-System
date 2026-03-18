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

const inputClass =
  'w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white text-neutral-800 text-sm shadow-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const selectClass =
  'w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white text-neutral-800 text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const labelClass = 'block text-sm font-medium text-neutral-700 mb-1';

const checkboxLabelClass =
  'flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-neutral-100 hover:bg-neutral-50 transition-all duration-200';

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
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-neutral-900 mb-5">معلومات الإعلان</h3>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              العنوان <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className={inputClass}
              placeholder="عنوان الإعلان"
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-error-600">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className={labelClass}>
              المحتوى <span className="text-error-500">*</span>
            </label>
            <textarea
              id="content"
              {...register('content')}
              rows={6}
              className={inputClass}
              placeholder="محتوى الإعلان..."
            />
            {errors.content && (
              <p className="mt-1.5 text-sm text-error-600">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Group */}
            <div>
              <label htmlFor="group_id" className={labelClass}>
                المجموعة
              </label>
              <select
                id="group_id"
                {...register('group_id', { valueAsNumber: true })}
                className={selectClass}
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
              <label htmlFor="priority" className={labelClass}>
                الأولوية <span className="text-error-500">*</span>
              </label>
              <select id="priority" {...register('priority')} className={selectClass}>
                {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className={labelClass}>
                النوع <span className="text-error-500">*</span>
              </label>
              <select id="type" {...register('type')} className={selectClass}>
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
            <label htmlFor="expires_at" className={labelClass}>
              تاريخ الانتهاء (اختياري)
            </label>
            <input
              type="datetime-local"
              id="expires_at"
              {...register('expires_at')}
              className={inputClass}
            />
          </div>

          {/* Pinned */}
          <label htmlFor="is_pinned" className={checkboxLabelClass}>
            <input
              type="checkbox"
              id="is_pinned"
              {...register('is_pinned')}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-neutral-700">
              تثبيت الإعلان في الأعلى
            </span>
          </label>

          {/* Publish immediately (only for new announcements) */}
          {!announcement && (
            <label htmlFor="publish" className={checkboxLabelClass}>
              <input
                type="checkbox"
                id="publish"
                {...register('publish')}
                className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-neutral-700">
                نشر الإعلان فوراً
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-gradient-to-l from-primary-600 to-primary-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:from-primary-700 hover:to-primary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'جاري الحفظ...' : announcement ? 'تحديث الإعلان' : 'إنشاء الإعلان'}
        </button>
      </div>
    </form>
  );
}
