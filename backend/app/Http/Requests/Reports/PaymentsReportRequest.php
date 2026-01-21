<?php

namespace App\Http\Requests\Reports;

use App\Enums\PaymentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentsReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && in_array($this->user()->role, ['teacher', 'admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'student_id' => 'nullable|exists:students,id',
            'status' => ['nullable', Rule::in(PaymentStatus::values())],
            'payment_method' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'start_date.date' => 'تاريخ البداية يجب أن يكون تاريخاً صحيحاً',
            'end_date.date' => 'تاريخ النهاية يجب أن يكون تاريخاً صحيحاً',
            'end_date.after_or_equal' => 'تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية',
            'student_id.exists' => 'الطالب المحدد غير موجود',
            'status.in' => 'حالة الدفع غير صحيحة',
        ];
    }
}
