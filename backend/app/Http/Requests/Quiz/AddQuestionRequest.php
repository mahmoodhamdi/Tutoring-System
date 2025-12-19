<?php

namespace App\Http\Requests\Quiz;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question_text' => 'required|string',
            'question_type' => ['required', Rule::in(['multiple_choice', 'true_false', 'short_answer', 'essay'])],
            'marks' => 'required|numeric|min:0.01|max:100',
            'explanation' => 'nullable|string',
            'options' => 'required_if:question_type,multiple_choice,true_false|array|min:2',
            'options.*.option_text' => 'required|string',
            'options.*.is_correct' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'question_text.required' => 'نص السؤال مطلوب',
            'question_type.required' => 'نوع السؤال مطلوب',
            'question_type.in' => 'نوع السؤال غير صالح',
            'marks.required' => 'درجة السؤال مطلوبة',
            'marks.min' => 'درجة السؤال يجب أن تكون أكبر من صفر',
            'marks.max' => 'درجة السؤال يجب ألا تتجاوز 100',
            'options.required_if' => 'خيارات الإجابة مطلوبة لهذا النوع من الأسئلة',
            'options.min' => 'يجب إضافة خيارين على الأقل',
            'options.*.option_text.required' => 'نص الخيار مطلوب',
        ];
    }

    protected function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $questionType = $this->input('question_type');
            $options = $this->input('options', []);

            // For multiple choice and true/false, ensure at least one correct option
            if (in_array($questionType, ['multiple_choice', 'true_false'])) {
                $hasCorrectOption = collect($options)->contains(fn($opt) => !empty($opt['is_correct']));
                if (!$hasCorrectOption) {
                    $validator->errors()->add('options', 'يجب تحديد إجابة صحيحة واحدة على الأقل');
                }
            }

            // For true/false, ensure exactly 2 options
            if ($questionType === 'true_false' && count($options) !== 2) {
                $validator->errors()->add('options', 'سؤال صح أو خطأ يجب أن يحتوي على خيارين فقط');
            }
        });
    }
}
