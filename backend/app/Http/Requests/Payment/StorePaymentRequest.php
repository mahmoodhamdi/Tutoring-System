<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isTeacher();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_id' => ['required', 'integer', 'exists:users,id'],
            'group_id' => ['nullable', 'integer', 'exists:groups,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', 'in:cash,bank_transfer,online'],
            'status' => ['required', 'in:paid,pending,partial'],
            'period_month' => ['required', 'integer', 'between:1,12'],
            'period_year' => ['required', 'integer', 'min:2020', 'max:2100'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'student_id.required' => 'يجب اختيار الطالب',
            'student_id.exists' => 'الطالب غير موجود',
            'group_id.exists' => 'المجموعة غير موجودة',
            'amount.required' => 'المبلغ مطلوب',
            'amount.numeric' => 'المبلغ يجب أن يكون رقماً',
            'amount.min' => 'المبلغ يجب أن يكون أكبر من صفر',
            'payment_date.required' => 'تاريخ الدفع مطلوب',
            'payment_date.date' => 'تاريخ الدفع غير صالح',
            'payment_method.required' => 'طريقة الدفع مطلوبة',
            'payment_method.in' => 'طريقة الدفع غير صالحة',
            'status.required' => 'حالة الدفع مطلوبة',
            'status.in' => 'حالة الدفع غير صالحة',
            'period_month.required' => 'الشهر مطلوب',
            'period_month.between' => 'الشهر يجب أن يكون بين 1 و 12',
            'period_year.required' => 'السنة مطلوبة',
            'period_year.min' => 'السنة غير صالحة',
            'period_year.max' => 'السنة غير صالحة',
            'notes.max' => 'الملاحظات يجب ألا تتجاوز 1000 حرف',
        ];
    }
}
