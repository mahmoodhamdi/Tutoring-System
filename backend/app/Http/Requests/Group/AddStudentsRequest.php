<?php

namespace App\Http\Requests\Group;

use Illuminate\Foundation\Http\FormRequest;

class AddStudentsRequest extends FormRequest
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
            'student_ids' => ['required', 'array', 'min:1'],
            'student_ids.*' => ['required', 'integer', 'exists:users,id'],
            'joined_at' => ['nullable', 'date'],
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
            'student_ids.required' => 'يجب اختيار طالب واحد على الأقل',
            'student_ids.array' => 'قائمة الطلاب غير صالحة',
            'student_ids.min' => 'يجب اختيار طالب واحد على الأقل',
            'student_ids.*.exists' => 'أحد الطلاب المحددين غير موجود',
            'joined_at.date' => 'تاريخ الانضمام غير صالح',
        ];
    }
}
