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

const inputClass =
  'block w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-neutral-800 text-sm shadow-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const selectClass =
  'block w-full rounded-xl border border-neutral-200 bg-white py-2 px-3 text-neutral-800 text-sm shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all duration-200';

const labelClass = 'block text-sm font-medium text-neutral-700 mb-1';

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
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm">
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="student_id" className={labelClass}>
                الطالب <span className="text-error-500">*</span>
              </label>
              <select
                id="student_id"
                {...register('student_id', { valueAsNumber: true })}
                className={selectClass}
              >
                <option value={0}>اختر الطالب</option>
                {studentsData?.data.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.phone}
                  </option>
                ))}
              </select>
              {errors.student_id && (
                <p className="mt-1.5 text-sm text-error-600">{errors.student_id.message}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="group_id" className={labelClass}>
                المجموعة
              </label>
              <select
                id="group_id"
                {...register('group_id', { valueAsNumber: true, setValueAs: v => v || null })}
                className={selectClass}
              >
                <option value="">بدون مجموعة</option>
                {groupsData?.data.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="amount" className={labelClass}>
                المبلغ (ج.م) <span className="text-error-500">*</span>
              </label>
              <input
                type="number"
                id="amount"
                {...register('amount', { valueAsNumber: true })}
                step="0.01"
                min="0"
                className={inputClass}
              />
              {errors.amount && (
                <p className="mt-1.5 text-sm text-error-600">{errors.amount.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="payment_date" className={labelClass}>
                تاريخ الدفع <span className="text-error-500">*</span>
              </label>
              <input
                type="date"
                id="payment_date"
                {...register('payment_date')}
                className={inputClass}
              />
              {errors.payment_date && (
                <p className="mt-1.5 text-sm text-error-600">{errors.payment_date.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="payment_method" className={labelClass}>
                طريقة الدفع <span className="text-error-500">*</span>
              </label>
              <select
                id="payment_method"
                {...register('payment_method')}
                className={selectClass}
              >
                <option value="cash">نقداً</option>
                <option value="bank_transfer">تحويل بنكي</option>
                <option value="online">دفع إلكتروني</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="period_month" className={labelClass}>
                الشهر <span className="text-error-500">*</span>
              </label>
              <select
                id="period_month"
                {...register('period_month', { valueAsNumber: true })}
                className={selectClass}
              >
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="period_year" className={labelClass}>
                السنة <span className="text-error-500">*</span>
              </label>
              <input
                type="number"
                id="period_year"
                {...register('period_year', { valueAsNumber: true })}
                min="2020"
                max="2100"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="status" className={labelClass}>
                الحالة <span className="text-error-500">*</span>
              </label>
              <select id="status" {...register('status')} className={selectClass}>
                <option value="paid">مدفوع</option>
                <option value="pending">معلق</option>
                <option value="partial">جزئي</option>
              </select>
            </div>

            <div className="col-span-full">
              <label htmlFor="notes" className={labelClass}>
                ملاحظات
              </label>
              <textarea
                id="notes"
                rows={3}
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
            {isSubmitting ? 'جاري الحفظ...' : payment ? 'تحديث' : 'تسجيل'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default PaymentForm;
