<?php

namespace App\Http\Requests\Announcement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'group_id' => 'nullable|exists:groups,id',
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'priority' => ['sometimes', Rule::in(['low', 'normal', 'high', 'urgent'])],
            'type' => ['sometimes', Rule::in(['general', 'schedule', 'exam', 'payment', 'event'])],
            'is_pinned' => 'boolean',
            'expires_at' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            'group_id.exists' => 'المجموعة المحددة غير موجودة',
            'title.required' => 'عنوان الإعلان مطلوب',
            'title.max' => 'عنوان الإعلان يجب ألا يتجاوز 255 حرفاً',
            'content.required' => 'محتوى الإعلان مطلوب',
            'priority.in' => 'الأولوية المحددة غير صالحة',
            'type.in' => 'نوع الإعلان غير صالح',
        ];
    }
}
