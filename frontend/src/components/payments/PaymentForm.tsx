'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Payment, PaymentFormData } from '@/types/payment';
import { useStudents } from '@/hooks/useStudents';
import { useGroups } from '@/hooks/useGroups';

const paymentSchema = z.object({
  student_id: z.number().min(1, 'يجب اختيار الطالب'),
  group_id: z.number().nullable().optional(),
  amount: z.number().min(0.01, 'المبلغ يجب أن يكون أكبر من صفر'),
  payment_date: z.string().min(1, 'تاريخ الدفع مطلوب'),
  payment_method: z.enum(['cash', 'bank_transfer', 'online']),
  status: z.enum(['paid', 'pending', 'partial']),
  period_month: z.number().min(1).max(12),
  period_year: z.number().min(2020).max(2100),
  notes: z.string().max(1000).nullable().optional(),
});

type FormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  payment?: Payment;
  onSubmit: (data: PaymentFormData) => void;
  isSubmitting?: boolean;
}

const MONTHS = [
  { value: 1, label: 'يناير' },
  { value: 2, label: 'فبراير' },
  { value: 3, label: 'مارس' },
  { value: 4, label: 'أبريل' },
  { value: 5, label: 'مايو' },
  { value: 6, label: 'يونيو' },
  { value: 7, label: 'يوليو' },
  { value: 8, label: 'أغسطس' },
  { value: 9, label: 'سبتمبر' },
  { value: 10, label: 'أكتوبر' },
  { value: 11, label: 'نوفمبر' },
  { value: 12, label: 'ديسمبر' },
];

export function PaymentForm({ payment, onSubmit, isSubmitting }: PaymentFormProps) {
  const { data: studentsData } = useStudents({ per_page: 100, status: 'active' });
  const { data: groupsData } = useGroups({ is_active: true });

  const currentDate = new Date();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      student_id: payment?.student_id || 0,
      group_id: payment?.group_id || null,
      amount: payment?.amount || 0,
      payment_date: payment?.payment_date || currentDate.toISOString().split('T')[0],
      payment_method: payment?.payment_method || 'cash',
      status: payment?.status === 'refunded' ? 'paid' : (payment?.status || 'paid'),
      period_month: payment?.period_month || currentDate.getMonth() + 1,
      period_year: payment?.period_year || currentDate.getFullYear(),
      notes: payment?.notes || '',
    },
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      group_id: data.group_id || null,
      notes: data.notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="student_id" className="block text-sm font-medium text-gray-900">
                الطالب <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="student_id"
                  {...register('student_id', { valueAsNumber: true })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                >
                  <option value={0}>اختر الطالب</option>
                  {studentsData?.data.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - {student.phone}
                    </option>
                  ))}
                </select>
                {errors.student_id && (
                  <p className="mt-2 text-sm text-red-600">{errors.student_id.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="group_id" className="block text-sm font-medium text-gray-900">
                المجموعة
              </label>
              <div className="mt-2">
                <select
                  id="group_id"
                  {...register('group_id', { valueAsNumber: true, setValueAs: v => v || null })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                >
                  <option value="">بدون مجموعة</option>
                  {groupsData?.data.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-900">
                المبلغ (ج.م) <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="amount"
                  {...register('amount', { valueAsNumber: true })}
                  step="0.01"
                  min="0"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
                {errors.amount && (
                  <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="payment_date" className="block text-sm font-medium text-gray-900">
                تاريخ الدفع <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  id="payment_date"
                  {...register('payment_date')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
                {errors.payment_date && (
                  <p className="mt-2 text-sm text-red-600">{errors.payment_date.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="payment_method" className="block text-sm font-medium text-gray-900">
                طريقة الدفع <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="payment_method"
                  {...register('payment_method')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                >
                  <option value="cash">نقداً</option>
                  <option value="bank_transfer">تحويل بنكي</option>
                  <option value="online">دفع إلكتروني</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="period_month" className="block text-sm font-medium text-gray-900">
                الشهر <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="period_month"
                  {...register('period_month', { valueAsNumber: true })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                >
                  {MONTHS.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="period_year" className="block text-sm font-medium text-gray-900">
                السنة <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="period_year"
                  {...register('period_year', { valueAsNumber: true })}
                  min="2020"
                  max="2100"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-900">
                الحالة <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <select
                  id="status"
                  {...register('status')}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                >
                  <option value="paid">مدفوع</option>
                  <option value="pending">معلق</option>
                  <option value="partial">جزئي</option>
                </select>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-900">
                ملاحظات
              </label>
              <div className="mt-2">
                <textarea
                  id="notes"
                  rows={3}
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
            {isSubmitting ? 'جاري الحفظ...' : payment ? 'تحديث' : 'تسجيل'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PaymentForm;
