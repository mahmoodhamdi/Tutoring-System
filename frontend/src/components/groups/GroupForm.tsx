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
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                اسم المجموعة <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="مثال: الرياضيات - الصف الثالث الثانوي"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
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
                  placeholder="وصف مختصر للمجموعة..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-900">
                المادة
              </label>
              <div className="mt-2">
                <select
                  id="subject"
                  {...register('subject')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                >
                  <option value="">اختر المادة</option>
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="mt-2 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="grade_level" className="block text-sm font-medium text-gray-900">
                المرحلة الدراسية
              </label>
              <div className="mt-2">
                <select
                  id="grade_level"
                  {...register('grade_level')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                >
                  <option value="">اختر المرحلة</option>
                  {GRADE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                {errors.grade_level && (
                  <p className="mt-2 text-sm text-red-600">{errors.grade_level.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="max_students" className="block text-sm font-medium text-gray-900">
                الحد الأقصى للطلاب
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="max_students"
                  {...register('max_students', { valueAsNumber: true })}
                  min={1}
                  max={100}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
                {errors.max_students && (
                  <p className="mt-2 text-sm text-red-600">{errors.max_students.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="monthly_fee" className="block text-sm font-medium text-gray-900">
                الرسوم الشهرية (ج.م)
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="monthly_fee"
                  {...register('monthly_fee', { valueAsNumber: true })}
                  min={0}
                  step="0.01"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
                {errors.monthly_fee && (
                  <p className="mt-2 text-sm text-red-600">{errors.monthly_fee.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="is_active" className="block text-sm font-medium text-gray-900">
                الحالة
              </label>
              <div className="mt-2">
                <select
                  id="is_active"
                  {...register('is_active', {
                    setValueAs: (v) => v === 'true',
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                >
                  <option value="true">نشطة</option>
                  <option value="false">غير نشطة</option>
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="schedule_description"
                className="block text-sm font-medium text-gray-900"
              >
                وصف الجدول
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="schedule_description"
                  {...register('schedule_description')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder="مثال: كل أحد وأربعاء من 4 إلى 6 مساءً"
                />
                {errors.schedule_description && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.schedule_description.message}
                  </p>
                )}
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
            className="rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'جاري الحفظ...' : group ? 'تحديث' : 'إنشاء'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default GroupForm;
