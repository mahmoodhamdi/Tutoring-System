<?php

namespace App\Http\Requests\Quiz;

use Illuminate\Foundation\Http\FormRequest;

class SubmitQuizRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:quiz_questions,id',
            'answers.*.selected_option_id' => 'nullable|exists:quiz_options,id',
            'answers.*.answer_text' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'answers.required' => 'يجب تقديم إجابات',
            'answers.array' => 'صيغة الإجابات غير صحيحة',
            'answers.*.question_id.required' => 'معرف السؤال مطلوب',
            'answers.*.question_id.exists' => 'السؤال غير موجود',
            'answers.*.selected_option_id.exists' => 'الخيار المحدد غير موجود',
        ];
    }
}
