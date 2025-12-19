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
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="group_id" className="block text-sm font-medium text-gray-900">
                المجموعة <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="group_id"
                  {...register('group_id', { valueAsNumber: true })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                >
                  <option value={0}>اختر المجموعة</option>
                  {groupsData?.data.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {errors.group_id && (
                  <p className="mt-2 text-sm text-red-600">{errors.group_id.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                عنوان الجلسة <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="title"
                  {...register('title')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="مثال: مراجعة الفصل الأول"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-900">
                التاريخ والوقت <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="datetime-local"
                  id="scheduled_at"
                  {...register('scheduled_at')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
                {errors.scheduled_at && (
                  <p className="mt-2 text-sm text-red-600">{errors.scheduled_at.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-900">
                المدة (بالدقائق)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="duration_minutes"
                  {...register('duration_minutes', { valueAsNumber: true })}
                  min={15}
                  max={480}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
                {errors.duration_minutes && (
                  <p className="mt-2 text-sm text-red-600">{errors.duration_minutes.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-gray-900">
                المكان
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="location"
                  {...register('location')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="مثال: القاعة 1"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                الوصف
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  rows={3}
                  {...register('description')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="وصف مختصر للجلسة..."
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-900">
                ملاحظات
              </label>
              <div className="mt-2">
                <textarea
                  id="notes"
                  rows={2}
                  {...register('notes')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-sm font-semibold text-gray-900"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الحفظ...' : session ? 'تحديث' : 'إنشاء'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default SessionForm;
