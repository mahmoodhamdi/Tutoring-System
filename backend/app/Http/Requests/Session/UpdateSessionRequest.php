<?php

namespace App\Http\Requests\Session;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSessionRequest extends FormRequest
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
            'group_id' => ['sometimes', 'integer', 'exists:groups,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'scheduled_at' => ['sometimes', 'date'],
            'duration_minutes' => ['sometimes', 'integer', 'min:15', 'max:480'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'status' => ['sometimes', 'in:scheduled,completed'],
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
            'group_id.exists' => 'المجموعة المحددة غير موجودة',
            'title.max' => 'عنوان الجلسة يجب ألا يتجاوز 255 حرف',
            'description.max' => 'الوصف يجب ألا يتجاوز 2000 حرف',
            'scheduled_at.date' => 'تاريخ ووقت الجلسة غير صالح',
            'duration_minutes.integer' => 'مدة الجلسة يجب أن تكون رقماً صحيحاً',
            'duration_minutes.min' => 'مدة الجلسة يجب أن تكون 15 دقيقة على الأقل',
            'duration_minutes.max' => 'مدة الجلسة يجب ألا تتجاوز 8 ساعات',
            'location.max' => 'المكان يجب ألا يتجاوز 255 حرف',
            'notes.max' => 'الملاحظات يجب ألا تتجاوز 2000 حرف',
            'status.in' => 'حالة الجلسة غير صالحة',
        ];
    }
}
