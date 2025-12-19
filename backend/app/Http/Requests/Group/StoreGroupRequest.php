<?php

namespace App\Http\Requests\Group;

use Illuminate\Foundation\Http\FormRequest;

class StoreGroupRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'subject' => ['nullable', 'string', 'max:255'],
            'grade_level' => ['nullable', 'string', 'max:50'],
            'max_students' => ['nullable', 'integer', 'min:1', 'max:100'],
            'monthly_fee' => ['nullable', 'numeric', 'min:0'],
            'schedule_description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['nullable', 'boolean'],
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
            'name.required' => 'اسم المجموعة مطلوب',
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
