<?php

namespace App\Http\Requests\Reports;

use App\Enums\AttendanceStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AttendanceReportRequest extends FormRequest
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
            'group_id' => 'nullable|exists:groups,id',
            'student_id' => 'nullable|exists:students,id',
            'status' => ['nullable', Rule::in(AttendanceStatus::values())],
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
            'group_id.exists' => 'المجموعة المحددة غير موجودة',
            'student_id.exists' => 'الطالب المحدد غير موجود',
            'status.in' => 'حالة الحضور غير صحيحة',
        ];
    }
}
