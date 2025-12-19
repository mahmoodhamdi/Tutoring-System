<?php

namespace App\Http\Requests\Exam;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'group_id' => 'sometimes|exists:groups,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:2000',
            'exam_date' => 'sometimes|date',
            'start_time' => 'nullable|date_format:H:i',
            'duration_minutes' => 'nullable|integer|min:15|max:480',
            'total_marks' => 'sometimes|numeric|min:1|max:1000',
            'pass_marks' => 'nullable|numeric|min:0|lte:total_marks',
            'exam_type' => 'sometimes|in:quiz,midterm,final,assignment',
            'instructions' => 'nullable|string|max:5000',
            'is_published' => 'boolean',
            'status' => 'sometimes|in:scheduled,in_progress,completed,cancelled',
        ];
    }

    public function messages(): array
    {
        return [
            'group_id.exists' => 'المجموعة المختارة غير موجودة',
            'title.max' => 'عنوان الاختبار يجب ألا يتجاوز 255 حرف',
            'description.max' => 'الوصف يجب ألا يتجاوز 2000 حرف',
            'exam_date.date' => 'تاريخ الاختبار غير صالح',
            'start_time.date_format' => 'وقت البداية غير صالح',
            'duration_minutes.integer' => 'مدة الاختبار يجب أن تكون رقماً صحيحاً',
            'duration_minutes.min' => 'مدة الاختبار يجب أن تكون 15 دقيقة على الأقل',
            'duration_minutes.max' => 'مدة الاختبار يجب ألا تتجاوز 480 دقيقة',
            'total_marks.numeric' => 'الدرجة الكلية يجب أن تكون رقماً',
            'total_marks.min' => 'الدرجة الكلية يجب أن تكون أكبر من صفر',
            'total_marks.max' => 'الدرجة الكلية يجب ألا تتجاوز 1000',
            'pass_marks.numeric' => 'درجة النجاح يجب أن تكون رقماً',
            'pass_marks.min' => 'درجة النجاح يجب أن تكون صفر أو أكثر',
            'pass_marks.lte' => 'درجة النجاح يجب أن تكون أقل من أو تساوي الدرجة الكلية',
            'exam_type.in' => 'نوع الاختبار غير صالح',
            'instructions.max' => 'التعليمات يجب ألا تتجاوز 5000 حرف',
            'status.in' => 'حالة الاختبار غير صالحة',
        ];
    }
}
