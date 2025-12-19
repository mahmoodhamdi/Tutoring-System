'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Exam, ExamFormData } from '@/types/exam';
import { useGroups } from '@/hooks/useGroups';

const examSchema = z.object({
  group_id: z.number().min(1, 'يجب اختيار المجموعة'),
  title: z.string().min(1, 'عنوان الاختبار مطلوب').max(255),
  description: z.string().max(2000).nullable().optional(),
  exam_date: z.string().min(1, 'تاريخ الاختبار مطلوب'),
  start_time: z.string().nullable().optional(),
  duration_minutes: z.number().min(15).max(480).optional(),
  total_marks: z.number().min(1, 'الدرجة الكلية مطلوبة').max(1000),
  pass_marks: z.number().min(0).nullable().optional(),
  exam_type: z.enum(['quiz', 'midterm', 'final', 'assignment']),
  instructions: z.string().max(5000).nullable().optional(),
  is_published: z.boolean().optional(),
});

type FormValues = z.infer<typeof examSchema>;

interface ExamFormProps {
  exam?: Exam;
  onSubmit: (data: ExamFormData) => void;
  isSubmitting?: boolean;
}

export function ExamForm({ exam, onSubmit, isSubmitting }: ExamFormProps) {
  const { data: groupsData } = useGroups({ is_active: true });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      group_id: exam?.group_id || 0,
      title: exam?.title || '',
      description: exam?.description || '',
      exam_date: exam?.exam_date || '',
      start_time: exam?.start_time || '',
      duration_minutes: exam?.duration_minutes || 60,
      total_marks: exam?.total_marks || 100,
      pass_marks: exam?.pass_marks || null,
      exam_type: exam?.exam_type || 'quiz',
      instructions: exam?.instructions || '',
      is_published: exam?.is_published || false,
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      description: data.description || null,
      start_time: data.start_time || null,
      pass_marks: data.pass_marks || null,
      instructions: data.instructions || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-900">
                عنوان الاختبار <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="title"
                  {...register('title')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="مثال: اختبار الفصل الأول"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
            </div>

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

            <div className="sm:col-span-2">
              <label htmlFor="exam_date" className="block text-sm font-medium text-gray-900">
                تاريخ الاختبار <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  id="exam_date"
                  {...register('exam_date')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
                {errors.exam_date && (
                  <p className="mt-2 text-sm text-red-600">{errors.exam_date.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="start_time" className="block text-sm font-medium text-gray-900">
                وقت البداية
              </label>
              <div className="mt-2">
                <input
                  type="time"
                  id="start_time"
                  {...register('start_time')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
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
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="exam_type" className="block text-sm font-medium text-gray-900">
                نوع الاختبار <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="exam_type"
                  {...register('exam_type')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                >
                  <option value="quiz">اختبار قصير</option>
                  <option value="midterm">اختبار نصفي</option>
                  <option value="final">اختبار نهائي</option>
                  <option value="assignment">واجب</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="total_marks" className="block text-sm font-medium text-gray-900">
                الدرجة الكلية <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="total_marks"
                  {...register('total_marks', { valueAsNumber: true })}
                  min={1}
                  max={1000}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
                {errors.total_marks && (
                  <p className="mt-2 text-sm text-red-600">{errors.total_marks.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="pass_marks" className="block text-sm font-medium text-gray-900">
                درجة النجاح
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="pass_marks"
                  {...register('pass_marks', { valueAsNumber: true })}
                  min={0}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="60% من الدرجة الكلية"
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
                  rows={2}
                  {...register('description')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="وصف مختصر للاختبار..."
                />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-900">
                التعليمات
              </label>
              <div className="mt-2">
                <textarea
                  id="instructions"
                  rows={3}
                  {...register('instructions')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="تعليمات للطلاب..."
                />
              </div>
            </div>

            <div className="col-span-full">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_published"
                  {...register('is_published')}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                />
                <label htmlFor="is_published" className="mr-2 text-sm text-gray-900">
                  نشر الاختبار (جعله مرئياً للطلاب)
                </label>
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
            {isSubmitting ? 'جاري الحفظ...' : exam ? 'تحديث' : 'إنشاء'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ExamForm;
