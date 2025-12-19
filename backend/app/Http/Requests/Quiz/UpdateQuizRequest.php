<?php

namespace App\Http\Requests\Quiz;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'group_id' => 'nullable|exists:groups,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'instructions' => 'nullable|string',
            'duration_minutes' => 'sometimes|required|integer|min:1|max:480',
            'pass_percentage' => 'sometimes|required|numeric|min:0|max:100',
            'max_attempts' => 'sometimes|required|integer|min:1|max:10',
            'shuffle_questions' => 'boolean',
            'shuffle_answers' => 'boolean',
            'show_correct_answers' => 'boolean',
            'show_score_immediately' => 'boolean',
            'available_from' => 'nullable|date',
            'available_until' => 'nullable|date|after:available_from',
        ];
    }

    public function messages(): array
    {
        return [
            'group_id.exists' => 'المجموعة المحددة غير موجودة',
            'title.required' => 'عنوان الاختبار مطلوب',
            'title.max' => 'عنوان الاختبار يجب ألا يتجاوز 255 حرفاً',
            'duration_minutes.required' => 'مدة الاختبار مطلوبة',
            'duration_minutes.min' => 'مدة الاختبار يجب أن تكون دقيقة واحدة على الأقل',
            'duration_minutes.max' => 'مدة الاختبار يجب ألا تتجاوز 480 دقيقة',
            'pass_percentage.required' => 'نسبة النجاح مطلوبة',
            'pass_percentage.min' => 'نسبة النجاح يجب أن تكون 0 على الأقل',
            'pass_percentage.max' => 'نسبة النجاح يجب ألا تتجاوز 100',
            'max_attempts.required' => 'عدد المحاولات المسموح بها مطلوب',
            'max_attempts.min' => 'يجب أن تكون محاولة واحدة على الأقل',
            'max_attempts.max' => 'عدد المحاولات يجب ألا يتجاوز 10',
            'available_until.after' => 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء',
        ];
    }
}
