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

const inputClass =
  'block w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-neutral-800 text-sm shadow-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const selectClass =
  'block w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-neutral-800 text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const labelClass = 'block text-sm font-medium text-neutral-700 mb-1';

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
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="title" className={labelClass}>
                عنوان الاختبار <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                {...register('title')}
                className={inputClass}
                placeholder="مثال: اختبار الفصل الأول"
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-error-600">{errors.title.message}</p>
              )}
            </div>

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

            <div className="sm:col-span-2">
              <label htmlFor="exam_date" className={labelClass}>
                تاريخ الاختبار <span className="text-error-500">*</span>
              </label>
              <input
                type="date"
                id="exam_date"
                {...register('exam_date')}
                className={inputClass}
              />
              {errors.exam_date && (
                <p className="mt-1.5 text-sm text-error-600">{errors.exam_date.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="start_time" className={labelClass}>
                وقت البداية
              </label>
              <input
                type="time"
                id="start_time"
                {...register('start_time')}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
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
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="exam_type" className={labelClass}>
                نوع الاختبار <span className="text-error-500">*</span>
              </label>
              <select
                id="exam_type"
                {...register('exam_type')}
                className={selectClass}
              >
                <option value="quiz">اختبار قصير</option>
                <option value="midterm">اختبار نصفي</option>
                <option value="final">اختبار نهائي</option>
                <option value="assignment">واجب</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="total_marks" className={labelClass}>
                الدرجة الكلية <span className="text-error-500">*</span>
              </label>
              <input
                type="number"
                id="total_marks"
                {...register('total_marks', { valueAsNumber: true })}
                min={1}
                max={1000}
                className={inputClass}
              />
              {errors.total_marks && (
                <p className="mt-1.5 text-sm text-error-600">{errors.total_marks.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="pass_marks" className={labelClass}>
                درجة النجاح
              </label>
              <input
                type="number"
                id="pass_marks"
                {...register('pass_marks', { valueAsNumber: true })}
                min={0}
                className={inputClass}
                placeholder="60% من الدرجة الكلية"
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className={labelClass}>
                الوصف
              </label>
              <textarea
                id="description"
                rows={2}
                {...register('description')}
                className={inputClass}
                placeholder="وصف مختصر للاختبار..."
              />
            </div>

            <div className="col-span-full">
              <label htmlFor="instructions" className={labelClass}>
                التعليمات
              </label>
              <textarea
                id="instructions"
                rows={3}
                {...register('instructions')}
                className={inputClass}
                placeholder="تعليمات للطلاب..."
              />
            </div>

            <div className="col-span-full">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="is_published"
                  {...register('is_published')}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-neutral-800">
                  نشر الاختبار (جعله مرئياً للطلاب)
                </span>
              </label>
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
            {isSubmitting ? 'جاري الحفظ...' : exam ? 'تحديث' : 'إنشاء'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ExamForm;
