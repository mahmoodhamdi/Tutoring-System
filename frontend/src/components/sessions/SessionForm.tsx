'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Session, SessionFormData } from '@/types/session';
import { useGroups } from '@/hooks/useGroups';

const sessionSchema = z.object({
  group_id: z.number().min(1, 'يجب اختيار المجموعة'),
  title: z.string().min(1, 'عنوان الجلسة مطلوب').max(255),
  description: z.string().max(2000).nullable().optional(),
  scheduled_at: z.string().min(1, 'تاريخ ووقت الجلسة مطلوب'),
  duration_minutes: z.number().min(15).max(480).optional(),
  location: z.string().max(255).nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

type FormValues = z.infer<typeof sessionSchema>;

interface SessionFormProps {
  session?: Session;
  onSubmit: (data: SessionFormData) => void;
  isSubmitting?: boolean;
}

const inputClass =
  'block w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-neutral-800 text-sm shadow-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const selectClass =
  'block w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-neutral-800 text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const labelClass = 'block text-sm font-medium text-neutral-700 mb-1';

export function SessionForm({ session, onSubmit, isSubmitting }: SessionFormProps) {
  const { data: groupsData } = useGroups({ is_active: true });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      group_id: session?.group_id || 0,
      title: session?.title || '',
      description: session?.description || '',
      scheduled_at: session?.scheduled_at
        ? new Date(session.scheduled_at).toISOString().slice(0, 16)
        : '',
      duration_minutes: session?.duration_minutes || 60,
      location: session?.location || '',
      notes: session?.notes || '',
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      description: data.description || null,
      location: data.location || null,
      notes: data.notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="group_id" className={labelClass}>
                المجموعة <span className="text-error-500">*</span>
              </label>
              <select
                id="group_id"
                {...register('group_id', { valueAsNumber: true })}
                className={selectClass}
              >
                <option value={0}>اختر المجموعة</option>
                {groupsData?.data.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {errors.group_id && (
                <p className="mt-1.5 text-sm text-error-600">{errors.group_id.message}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="title" className={labelClass}>
                عنوان الجلسة <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                {...register('title')}
                className={inputClass}
                placeholder="مثال: مراجعة الفصل الأول"
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-error-600">{errors.title.message}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="scheduled_at" className={labelClass}>
                التاريخ والوقت <span className="text-error-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="scheduled_at"
                {...register('scheduled_at')}
                className={inputClass}
              />
              {errors.scheduled_at && (
                <p className="mt-1.5 text-sm text-error-600">{errors.scheduled_at.message}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="duration_minutes" className={labelClass}>
                المدة (بالدقائق)
              </label>
              <input
                type="number"
                id="duration_minutes"
                {...register('duration_minutes', { valueAsNumber: true })}
                min={15}
                max={480}
                className={inputClass}
              />
              {errors.duration_minutes && (
                <p className="mt-1.5 text-sm text-error-600">{errors.duration_minutes.message}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="location" className={labelClass}>
                المكان
              </label>
              <input
                type="text"
                id="location"
                {...register('location')}
                className={inputClass}
                placeholder="مثال: القاعة 1"
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className={labelClass}>
                الوصف
              </label>
              <textarea
                id="description"
                rows={3}
                {...register('description')}
                className={inputClass}
                placeholder="وصف مختصر للجلسة..."
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="notes" className={labelClass}>
                ملاحظات
              </label>
              <textarea
                id="notes"
                rows={2}
                {...register('notes')}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-4 border-t border-neutral-100 px-6 py-4">
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
            className="rounded-xl bg-gradient-to-l from-primary-600 to-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:from-primary-700 hover:to-primary-600 transition-all duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الحفظ...' : session ? 'تحديث' : 'إنشاء'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default SessionForm;
