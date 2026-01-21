<?php

namespace App\Http\Requests\Group;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateGroupRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'subject' => ['sometimes', 'nullable', 'string', 'max:255'],
            'grade_level' => ['sometimes', 'nullable', 'string', 'max:50'],
            'max_students' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'monthly_fee' => ['sometimes', 'numeric', 'min:0'],
            'schedule_description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if ($this->has('max_students')) {
                $group = $this->route('group');
                $currentStudentCount = $group->activeStudents()->count();

                if ($this->max_students < $currentStudentCount) {
                    $validator->errors()->add(
                        'max_students',
                        'لا يمكن تقليل الحد الأقصى للطلاب إلى أقل من عدد الطلاب الحاليين'
                    );
                }
            }
        });
    }

    /**
     * Get custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.max' => 'اسم المجموعة يجب ألا يتجاوز 255 حرف',
            'description.max' => 'الوصف يجب ألا يتجاوز 2000 حرف',
            'subject.max' => 'المادة يجب ألا تتجاوز 255 حرف',
            'grade_level.max' => 'المرحلة الدراسية يجب ألا تتجاوز 50 حرف',
            'max_students.integer' => 'الحد الأقصى للطلاب يجب أن يكون رقماً صحيحاً',
            'max_students.min' => 'الحد الأقصى للطلاب يجب أن يكون 1 على الأقل',
            'max_students.max' => 'الحد الأقصى للطلاب يجب ألا يتجاوز 100',
            'monthly_fee.numeric' => 'الرسوم الشهرية يجب أن تكون رقماً',
            'monthly_fee.min' => 'الرسوم الشهرية لا يمكن أن تكون سالبة',
            'schedule_description.max' => 'وصف الجدول يجب ألا يتجاوز 1000 حرف',
        ];
    }
}
