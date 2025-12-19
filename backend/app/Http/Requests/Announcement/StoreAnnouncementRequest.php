<?php

namespace App\Http\Requests\Announcement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'group_id' => 'nullable|exists:groups,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'priority' => ['sometimes', Rule::in(['low', 'normal', 'high', 'urgent'])],
            'type' => ['sometimes', Rule::in(['general', 'schedule', 'exam', 'payment', 'event'])],
            'is_pinned' => 'boolean',
            'expires_at' => 'nullable|date|after:now',
            'publish' => 'boolean',
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
            'expires_at.after' => 'تاريخ الانتهاء يجب أن يكون في المستقبل',
        ];
    }
}
