<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'name' => ['sometimes', 'string', 'min:2', 'max:255'],
            'email' => ['sometimes', 'nullable', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'phone' => ['sometimes', 'string', 'min:10', 'max:20', Rule::unique('users', 'phone')->ignore($userId)],
            'date_of_birth' => ['sometimes', 'nullable', 'date'],
            'gender' => ['sometimes', 'nullable', 'string', 'in:male,female'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
            'avatar' => ['sometimes', 'nullable', 'string', 'max:255'],
            'school_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'grade_level' => ['sometimes', 'nullable', 'string', 'max:100'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.min' => 'الاسم يجب أن يكون أكثر من حرفين',
            'email.email' => 'البريد الإلكتروني غير صالح',
            'email.unique' => 'البريد الإلكتروني مستخدم بالفعل',
            'phone.unique' => 'رقم الهاتف مستخدم بالفعل',
            'phone.min' => 'رقم الهاتف يجب أن يكون 10 أرقام على الأقل',
            'gender.in' => 'الجنس غير صالح',
        ];
    }
}
