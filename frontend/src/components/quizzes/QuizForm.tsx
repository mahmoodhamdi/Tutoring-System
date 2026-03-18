'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Quiz, CreateQuizData } from '@/types/quiz';
import { useGroups } from '@/hooks/useGroups';

const quizSchema = z.object({
  group_id: z.number().optional().nullable(),
  title: z.string().min(1, 'عنوان الاختبار مطلوب'),
  description: z.string().optional(),
  instructions: z.string().optional(),
  duration_minutes: z.number().min(1, 'المدة يجب أن تكون دقيقة واحدة على الأقل').max(480),
  pass_percentage: z.number().min(0).max(100, 'نسبة النجاح يجب أن تكون بين 0 و 100'),
  max_attempts: z.number().min(1).max(10, 'عدد المحاولات يجب أن يكون بين 1 و 10'),
  shuffle_questions: z.boolean().optional(),
  shuffle_answers: z.boolean().optional(),
  show_correct_answers: z.boolean().optional(),
  show_score_immediately: z.boolean().optional(),
  available_from: z.string().optional(),
  available_until: z.string().optional(),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface QuizFormProps {
  quiz?: Quiz;
  onSubmit: (data: CreateQuizData) => void;
  isSubmitting?: boolean;
}

const inputClass =
  'w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white text-neutral-800 text-sm shadow-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const selectClass =
  'w-full px-3 py-2 border border-neutral-200 rounded-xl bg-white text-neutral-800 text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const labelClass = 'block text-sm font-medium text-neutral-700 mb-1';

const sectionClass = 'bg-white rounded-2xl border border-neutral-100 shadow-sm p-6';

const checkboxLabelClass =
  'flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-neutral-100 hover:bg-neutral-50 transition-all duration-200';

export function QuizForm({ quiz, onSubmit, isSubmitting }: QuizFormProps) {
  const { data: groupsData } = useGroups();
  const groups = groupsData?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      group_id: quiz?.group_id || undefined,
      title: quiz?.title || '',
      description: quiz?.description || '',
      instructions: quiz?.instructions || '',
      duration_minutes: quiz?.duration_minutes || 30,
      pass_percentage: quiz?.pass_percentage || 60,
      max_attempts: quiz?.max_attempts || 1,
      shuffle_questions: quiz?.shuffle_questions || false,
      shuffle_answers: quiz?.shuffle_answers || false,
      show_correct_answers: quiz?.show_correct_answers ?? true,
      show_score_immediately: quiz?.show_score_immediately ?? true,
      available_from: quiz?.available_from?.slice(0, 16) || '',
      available_until: quiz?.available_until?.slice(0, 16) || '',
    },
  });

  const handleFormSubmit = (data: QuizFormData) => {
    onSubmit({
      ...data,
      group_id: data.group_id || undefined,
      available_from: data.available_from || undefined,
      available_until: data.available_until || undefined,
    } as CreateQuizData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-neutral-900 mb-5">معلومات أساسية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label htmlFor="title" className={labelClass}>
              عنوان الاختبار <span className="text-error-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className={inputClass}
              placeholder="مثال: اختبار الوحدة الأولى"
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-error-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="group_id" className={labelClass}>
              المجموعة
            </label>
            <select
              id="group_id"
              {...register('group_id', { valueAsNumber: true })}
              className={selectClass}
            >
              <option value="">اختر المجموعة (اختياري)</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="duration_minutes" className={labelClass}>
              المدة (بالدقائق) <span className="text-error-500">*</span>
            </label>
            <input
              type="number"
              id="duration_minutes"
              {...register('duration_minutes', { valueAsNumber: true })}
              min={1}
              max={480}
              className={inputClass}
            />
            {errors.duration_minutes && (
              <p className="mt-1.5 text-sm text-error-600">{errors.duration_minutes.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClass}>
              الوصف
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className={inputClass}
              placeholder="وصف مختصر للاختبار"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="instructions" className={labelClass}>
              تعليمات الاختبار
            </label>
            <textarea
              id="instructions"
              {...register('instructions')}
              rows={3}
              className={inputClass}
              placeholder="تعليمات للطلاب قبل بدء الاختبار"
            />
          </div>
        </div>
      </div>

      {/* Scoring Settings */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-neutral-900 mb-5">إعدادات التقييم</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="pass_percentage" className={labelClass}>
              نسبة النجاح (%) <span className="text-error-500">*</span>
            </label>
            <input
              type="number"
              id="pass_percentage"
              {...register('pass_percentage', { valueAsNumber: true })}
              min={0}
              max={100}
              className={inputClass}
            />
            {errors.pass_percentage && (
              <p className="mt-1.5 text-sm text-error-600">{errors.pass_percentage.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="max_attempts" className={labelClass}>
              الحد الأقصى للمحاولات <span className="text-error-500">*</span>
            </label>
            <input
              type="number"
              id="max_attempts"
              {...register('max_attempts', { valueAsNumber: true })}
              min={1}
              max={10}
              className={inputClass}
            />
            {errors.max_attempts && (
              <p className="mt-1.5 text-sm text-error-600">{errors.max_attempts.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-neutral-900 mb-5">إعدادات العرض</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className={checkboxLabelClass}>
            <input
              type="checkbox"
              {...register('shuffle_questions')}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-neutral-700">خلط ترتيب الأسئلة</span>
          </label>

          <label className={checkboxLabelClass}>
            <input
              type="checkbox"
              {...register('shuffle_answers')}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-neutral-700">خلط ترتيب الخيارات</span>
          </label>

          <label className={checkboxLabelClass}>
            <input
              type="checkbox"
              {...register('show_correct_answers')}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-neutral-700">إظهار الإجابات الصحيحة بعد الانتهاء</span>
          </label>

          <label className={checkboxLabelClass}>
            <input
              type="checkbox"
              {...register('show_score_immediately')}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-neutral-700">إظهار النتيجة فوراً</span>
          </label>
        </div>
      </div>

      {/* Availability */}
      <div className={sectionClass}>
        <h3 className="text-base font-bold text-neutral-900 mb-5">فترة الإتاحة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="available_from" className={labelClass}>
              متاح من
            </label>
            <input
              type="datetime-local"
              id="available_from"
              {...register('available_from')}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="available_until" className={labelClass}>
              متاح حتى
            </label>
            <input
              type="datetime-local"
              id="available_until"
              {...register('available_until')}
              className={inputClass}
            />
          </div>
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
          {isSubmitting ? 'جاري الحفظ...' : quiz ? 'تحديث الاختبار' : 'إنشاء الاختبار'}
        </button>
      </div>
    </form>
  );
}
