'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Group, GroupFormData } from '@/types/group';

const groupSchema = z.object({
  name: z.string().min(1, 'اسم المجموعة مطلوب').max(255, 'اسم المجموعة طويل جداً'),
  description: z.string().max(2000, 'الوصف طويل جداً').nullable().optional(),
  subject: z.string().max(255, 'اسم المادة طويل جداً').nullable().optional(),
  grade_level: z.string().max(50, 'اسم المرحلة طويل جداً').nullable().optional(),
  max_students: z
    .number()
    .int('يجب أن يكون رقماً صحيحاً')
    .min(1, 'الحد الأدنى هو 1')
    .max(100, 'الحد الأقصى هو 100')
    .optional(),
  monthly_fee: z.number().min(0, 'لا يمكن أن تكون سالبة').optional(),
  schedule_description: z.string().max(1000, 'وصف الجدول طويل جداً').nullable().optional(),
  is_active: z.boolean().optional(),
});

type FormValues = z.infer<typeof groupSchema>;

interface GroupFormProps {
  group?: Group;
  onSubmit: (data: GroupFormData) => void;
  isSubmitting?: boolean;
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
  'الفلسفة',
  'علم النفس',
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

const inputClass =
  'block w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-neutral-800 text-sm shadow-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const selectClass =
  'block w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-neutral-800 text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const labelClass = 'block text-sm font-medium text-neutral-700 mb-1';

export function GroupForm({ group, onSubmit, isSubmitting }: GroupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: group?.name || '',
      description: group?.description || '',
      subject: group?.subject || '',
      grade_level: group?.grade_level || '',
      max_students: group?.max_students || 20,
      monthly_fee: group?.monthly_fee || 0,
      schedule_description: group?.schedule_description || '',
      is_active: group?.is_active ?? true,
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      description: data.description || null,
      subject: data.subject || null,
      grade_level: data.grade_level || null,
      schedule_description: data.schedule_description || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className={labelClass}>
                اسم المجموعة <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className={inputClass}
                placeholder="مثال: الرياضيات - الصف الثالث الثانوي"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-error-600">{errors.name.message}</p>
              )}
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
                placeholder="وصف مختصر للمجموعة..."
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-error-600">{errors.description.message}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="subject" className={labelClass}>
                المادة
              </label>
              <select id="subject" {...register('subject')} className={selectClass}>
                <option value="">اختر المادة</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              {errors.subject && (
                <p className="mt-1.5 text-sm text-error-600">{errors.subject.message}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="grade_level" className={labelClass}>
                المرحلة الدراسية
              </label>
              <select id="grade_level" {...register('grade_level')} className={selectClass}>
                <option value="">اختر المرحلة</option>
                {GRADE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              {errors.grade_level && (
                <p className="mt-1.5 text-sm text-error-600">{errors.grade_level.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="max_students" className={labelClass}>
                الحد الأقصى للطلاب
              </label>
              <input
                type="number"
                id="max_students"
                {...register('max_students', { valueAsNumber: true })}
                min={1}
                max={100}
                className={inputClass}
              />
              {errors.max_students && (
                <p className="mt-1.5 text-sm text-error-600">{errors.max_students.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="monthly_fee" className={labelClass}>
                الرسوم الشهرية (ج.م)
              </label>
              <input
                type="number"
                id="monthly_fee"
                {...register('monthly_fee', { valueAsNumber: true })}
                min={0}
                step="0.01"
                className={inputClass}
              />
              {errors.monthly_fee && (
                <p className="mt-1.5 text-sm text-error-600">{errors.monthly_fee.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="is_active" className={labelClass}>
                الحالة
              </label>
              <select
                id="is_active"
                {...register('is_active', {
                  setValueAs: (v) => v === 'true',
                })}
                className={selectClass}
              >
                <option value="true">نشطة</option>
                <option value="false">غير نشطة</option>
              </select>
            </div>

            <div className="col-span-full">
              <label htmlFor="schedule_description" className={labelClass}>
                وصف الجدول
              </label>
              <input
                type="text"
                id="schedule_description"
                {...register('schedule_description')}
                className={inputClass}
                placeholder="مثال: كل أحد وأربعاء من 4 إلى 6 مساءً"
              />
              {errors.schedule_description && (
                <p className="mt-1.5 text-sm text-error-600">
                  {errors.schedule_description.message}
                </p>
              )}
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
            className="rounded-xl bg-gradient-to-l from-primary-600 to-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:from-primary-700 hover:to-primary-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'جاري الحفظ...' : group ? 'تحديث' : 'إنشاء'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default GroupForm;
