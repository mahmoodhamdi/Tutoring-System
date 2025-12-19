<?php

namespace App\Http\Requests\Exam;

use Illuminate\Foundation\Http\FormRequest;

class RecordExamResultsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $exam = $this->route('exam');
        $maxMarks = $exam ? $exam->total_marks : 1000;

        return [
            'results' => 'required|array|min:1',
            'results.*.student_id' => 'required|exists:users,id',
            'results.*.marks_obtained' => 'nullable|numeric|min:0|max:' . $maxMarks,
            'results.*.status' => 'required|in:pending,submitted,graded,absent',
            'results.*.feedback' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'results.required' => 'يجب إدخال نتائج الطلاب',
            'results.array' => 'صيغة النتائج غير صالحة',
            'results.min' => 'يجب إدخال نتيجة واحدة على الأقل',
            'results.*.student_id.required' => 'معرف الطالب مطلوب',
            'results.*.student_id.exists' => 'الطالب غير موجود',
            'results.*.marks_obtained.numeric' => 'الدرجة يجب أن تكون رقماً',
            'results.*.marks_obtained.min' => 'الدرجة لا يمكن أن تكون سالبة',
            'results.*.marks_obtained.max' => 'الدرجة لا يمكن أن تتجاوز الدرجة الكلية',
            'results.*.status.required' => 'حالة النتيجة مطلوبة',
            'results.*.status.in' => 'حالة النتيجة غير صالحة',
            'results.*.feedback.max' => 'الملاحظات يجب ألا تتجاوز 1000 حرف',
        ];
    }
}
