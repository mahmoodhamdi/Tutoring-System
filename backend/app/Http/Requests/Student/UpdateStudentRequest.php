<?php

namespace App\Http\Requests\Student;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateStudentRequest extends FormRequest
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
        $studentId = $this->route('student')->id;

        return [
            // User fields
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'nullable',
                'email',
                Rule::unique('users', 'email')->ignore($studentId),
            ],
            'phone' => [
                'sometimes',
                'string',
                'max:20',
                Rule::unique('users', 'phone')->ignore($studentId),
            ],
            'password' => ['sometimes', 'nullable', Password::min(8)],
            'date_of_birth' => ['sometimes', 'nullable', 'date', 'before:today'],
            'gender' => ['sometimes', 'nullable', 'in:male,female'],
            'is_active' => ['sometimes', 'boolean'],

            // Profile fields
            'parent_id' => ['sometimes', 'nullable', 'exists:users,id'],
            'grade_level' => ['sometimes', 'nullable', 'string', 'max:50'],
            'school_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'emergency_contact_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['sometimes', 'nullable', 'string', 'max:20'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'enrollment_date' => ['sometimes', 'nullable', 'date'],
            'status' => ['sometimes', 'in:active,inactive,suspended'],
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
            'name.max' => 'اسم الطالب يجب ألا يتجاوز 255 حرف',
            'email.email' => 'البريد الإلكتروني غير صالح',
            'email.unique' => 'البريد الإلكتروني مستخدم بالفعل',
            'phone.unique' => 'رقم الهاتف مستخدم بالفعل',
            'phone.max' => 'رقم الهاتف يجب ألا يتجاوز 20 رقم',
            'password.min' => 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
            'date_of_birth.date' => 'تاريخ الميلاد غير صالح',
            'date_of_birth.before' => 'تاريخ الميلاد يجب أن يكون قبل اليوم',
            'gender.in' => 'الجنس يجب أن يكون ذكر أو أنثى',
            'parent_id.exists' => 'ولي الأمر غير موجود',
            'grade_level.max' => 'المرحلة الدراسية يجب ألا تتجاوز 50 حرف',
            'school_name.max' => 'اسم المدرسة يجب ألا يتجاوز 255 حرف',
            'address.max' => 'العنوان يجب ألا يتجاوز 1000 حرف',
            'emergency_contact_name.max' => 'اسم جهة الاتصال الطارئة يجب ألا يتجاوز 255 حرف',
            'emergency_contact_phone.max' => 'رقم جهة الاتصال الطارئة يجب ألا يتجاوز 20 رقم',
            'notes.max' => 'الملاحظات يجب ألا تتجاوز 2000 حرف',
            'enrollment_date.date' => 'تاريخ التسجيل غير صالح',
            'status.in' => 'الحالة يجب أن تكون نشط أو غير نشط أو معلق',
        ];
    }
}
