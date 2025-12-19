<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentRequest extends FormRequest
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
            'amount' => ['sometimes', 'numeric', 'min:0.01'],
            'payment_date' => ['sometimes', 'date'],
            'payment_method' => ['sometimes', 'in:cash,bank_transfer,online'],
            'status' => ['sometimes', 'in:paid,pending,partial,refunded'],
            'period_month' => ['sometimes', 'integer', 'between:1,12'],
            'period_year' => ['sometimes', 'integer', 'min:2020', 'max:2100'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:1000'],
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
            'amount.numeric' => 'المبلغ يجب أن يكون رقماً',
            'amount.min' => 'المبلغ يجب أن يكون أكبر من صفر',
            'payment_date.date' => 'تاريخ الدفع غير صالح',
            'payment_method.in' => 'طريقة الدفع غير صالحة',
            'status.in' => 'حالة الدفع غير صالحة',
            'period_month.between' => 'الشهر يجب أن يكون بين 1 و 12',
            'period_year.min' => 'السنة غير صالحة',
            'period_year.max' => 'السنة غير صالحة',
            'notes.max' => 'الملاحظات يجب ألا تتجاوز 1000 حرف',
        ];
    }
}
