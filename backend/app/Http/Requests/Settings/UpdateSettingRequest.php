<?php

namespace App\Http\Requests\Settings;

use App\Models\Setting;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
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
        $setting = Setting::where('key', $this->route('key'))->first();
        $rules = ['value' => 'present'];

        if ($setting) {
            switch ($setting->type) {
                case 'boolean':
                    $rules['value'] = 'present|boolean';
                    break;
                case 'integer':
                    $rules['value'] = 'present|integer';
                    break;
                case 'json':
                case 'array':
                    $rules['value'] = 'present|array';
                    break;
                default:
                    $rules['value'] = 'present|string|nullable';
            }
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'value.present' => 'قيمة الإعداد مطلوبة',
            'value.boolean' => 'يجب أن تكون القيمة صح أو خطأ',
            'value.integer' => 'يجب أن تكون القيمة رقماً صحيحاً',
            'value.array' => 'يجب أن تكون القيمة مصفوفة',
            'value.string' => 'يجب أن تكون القيمة نصاً',
        ];
    }
}
