<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResultResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'exam_id' => $this->exam_id,
            'student_id' => $this->student_id,
            'marks_obtained' => $this->marks_obtained ? (float) $this->marks_obtained : null,
            'percentage' => $this->percentage ? (float) $this->percentage : null,
            'grade' => $this->grade,
            'grade_label' => $this->grade_label,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'feedback' => $this->feedback,
            'is_passed' => $this->is_passed,
            'graded_by' => $this->graded_by,
            'graded_at' => $this->graded_at?->toISOString(),
            'student' => $this->when(
                $this->relationLoaded('student'),
                fn () => [
                    'id' => $this->student->id,
                    'name' => $this->student->name,
                    'phone' => $this->student->phone,
                    'email' => $this->student->email,
                ]
            ),
            'exam' => new ExamResource($this->whenLoaded('exam')),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
