'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Student, CreateStudentData, UpdateStudentData } from '@/types/student';

const studentSchema = z.object({
  name: z.string().min(1, 'الاسم مطلوب').max(255, 'الاسم طويل جداً'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  phone: z.string().min(1, 'رقم الهاتف مطلوب').max(20, 'رقم الهاتف غير صالح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل').optional().or(z.literal('')),
  date_of_birth: z.string().optional().or(z.literal('')),
  gender: z.enum(['male', 'female']).optional(),
  is_active: z.boolean().optional(),
  parent_id: z.number().optional().nullable(),
  grade_level: z.string().max(50, 'المرحلة الدراسية طويلة جداً').optional().or(z.literal('')),
  school_name: z.string().max(255, 'اسم المدرسة طويل جداً').optional().or(z.literal('')),
  address: z.string().max(1000, 'العنوان طويل جداً').optional().or(z.literal('')),
  emergency_contact_name: z.string().max(255, 'اسم جهة الاتصال طويل جداً').optional().or(z.literal('')),
  emergency_contact_phone: z.string().max(20, 'رقم جهة الاتصال غير صالح').optional().or(z.literal('')),
  notes: z.string().max(2000, 'الملاحظات طويلة جداً').optional().or(z.literal('')),
  enrollment_date: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: CreateStudentData | UpdateStudentData) => Promise<void>;
  isLoading?: boolean;
}

const gradeLevels = [
  'الصف الأول',
  'الصف الثاني',
  'الصف الثالث',
  'الصف الرابع',
  'الصف الخامس',
  'الصف السادس',
  'الصف السابع',
  'الصف الثامن',
  'الصف التاسع',
  'الصف العاشر',
  'الصف الحادي عشر',
  'الصف الثاني عشر',
];

export function StudentForm({ student, onSubmit, isLoading = false }: StudentFormProps) {
  const isEdit = !!student;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: student?.name || '',
      email: student?.email || '',
      phone: student?.phone || '',
      password: '',
      date_of_birth: student?.date_of_birth || '',
      gender: student?.gender || undefined,
      is_active: student?.is_active ?? true,
      parent_id: student?.profile?.parent?.id || undefined,
      grade_level: student?.profile?.grade_level || '',
      school_name: student?.profile?.school_name || '',
      address: student?.profile?.address || '',
      emergency_contact_name: student?.profile?.emergency_contact_name || '',
      emergency_contact_phone: student?.profile?.emergency_contact_phone || '',
      notes: student?.profile?.notes || '',
      enrollment_date: student?.profile?.enrollment_date || '',
      status: student?.profile?.status || 'active',
    },
  });

  const handleFormSubmit = async (data: StudentFormData) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== '' && value !== undefined)
    );
    await onSubmit(cleanData as CreateStudentData | UpdateStudentData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">المعلومات الأساسية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="الاسم *"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="رقم الهاتف *"
            {...register('phone')}
            error={errors.phone?.message}
            placeholder="+201234567890"
          />
          <Input
            label="البريد الإلكتروني"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label={isEdit ? 'كلمة المرور الجديدة' : 'كلمة المرور *'}
            type="password"
            {...register('password')}
            error={errors.password?.message}
            helperText={isEdit ? 'اتركها فارغة إذا لم ترد تغييرها' : undefined}
          />
          <Input
            label="تاريخ الميلاد"
            type="date"
            {...register('date_of_birth')}
            error={errors.date_of_birth?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الجنس
            </label>
            <select
              {...register('gender')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">اختر الجنس</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Student Profile */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">معلومات الطالب</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المرحلة الدراسية
            </label>
            <select
              {...register('grade_level')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">اختر المرحلة</option>
              {gradeLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="المدرسة"
            {...register('school_name')}
            error={errors.school_name?.message}
          />
          <Input
            label="تاريخ التسجيل"
            type="date"
            {...register('enrollment_date')}
            error={errors.enrollment_date?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الحالة
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="suspended">معلق</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              العنوان
            </label>
            <textarea
              {...register('address')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">جهة الاتصال الطارئة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="الاسم"
            {...register('emergency_contact_name')}
            error={errors.emergency_contact_name?.message}
          />
          <Input
            label="رقم الهاتف"
            {...register('emergency_contact_phone')}
            error={errors.emergency_contact_phone?.message}
          />
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">ملاحظات</h3>
        <textarea
          {...register('notes')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="أضف أي ملاحظات إضافية عن الطالب..."
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* Account Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_active')}
            id="is_active"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="mr-2 block text-sm text-gray-900">
            الحساب نشط
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          إلغاء
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? 'حفظ التغييرات' : 'إضافة الطالب'}
        </Button>
      </div>
    </form>
  );
}
