<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'teacher';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string|exists:settings,key',
            'settings.*.value' => 'present',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'settings.required' => 'يجب تقديم الإعدادات للتحديث',
            'settings.array' => 'يجب أن تكون الإعدادات مصفوفة',
            'settings.*.key.required' => 'مفتاح الإعداد مطلوب',
            'settings.*.key.exists' => 'الإعداد غير موجود',
            'settings.*.value.present' => 'قيمة الإعداد مطلوبة',
        ];
    }
}
