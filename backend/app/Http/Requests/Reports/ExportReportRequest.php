<?php

namespace App\Http\Requests\Reports;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExportReportRequest extends FormRequest
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
        $csvTypes = ['attendance', 'payments', 'performance', 'students', 'sessions'];
        $pdfTypes = ['attendance', 'payments', 'students', 'performance'];

        $isPdf = $this->routeIs('reports.export.pdf') || str_contains($this->path(), 'pdf');

        return [
            'report_type' => ['required', Rule::in($isPdf ? $pdfTypes : $csvTypes)],
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'group_id' => 'nullable|exists:groups,id',
            'student_id' => 'nullable|exists:students,id',
            'status' => 'nullable|string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'report_type.required' => 'نوع التقرير مطلوب',
            'report_type.in' => 'نوع التقرير غير صحيح',
            'start_date.date' => 'تاريخ البداية يجب أن يكون تاريخاً صحيحاً',
            'end_date.date' => 'تاريخ النهاية يجب أن يكون تاريخاً صحيحاً',
            'end_date.after_or_equal' => 'تاريخ النهاية يجب أن يكون بعد أو يساوي تاريخ البداية',
            'group_id.exists' => 'المجموعة المحددة غير موجودة',
            'student_id.exists' => 'الطالب المحدد غير موجود',
        ];
    }
}
