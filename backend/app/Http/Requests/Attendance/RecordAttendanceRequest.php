<?php

namespace App\Http\Requests\Attendance;

use Illuminate\Foundation\Http\FormRequest;

class RecordAttendanceRequest extends FormRequest
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
            'attendances' => ['required', 'array', 'min:1'],
            'attendances.*.student_id' => ['required', 'integer', 'exists:users,id'],
            'attendances.*.status' => ['required', 'in:present,absent,late,excused'],
            'attendances.*.check_in_time' => ['nullable', 'date'],
            'attendances.*.notes' => ['nullable', 'string', 'max:500'],
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
            'attendances.required' => 'بيانات الحضور مطلوبة',
            'attendances.array' => 'بيانات الحضور غير صالحة',
            'attendances.min' => 'يجب تسجيل حضور طالب واحد على الأقل',
            'attendances.*.student_id.required' => 'معرف الطالب مطلوب',
            'attendances.*.student_id.exists' => 'الطالب غير موجود',
            'attendances.*.status.required' => 'حالة الحضور مطلوبة',
            'attendances.*.status.in' => 'حالة الحضور غير صالحة',
            'attendances.*.notes.max' => 'الملاحظات يجب ألا تتجاوز 500 حرف',
        ];
    }
}
