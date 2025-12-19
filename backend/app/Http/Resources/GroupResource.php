<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GroupResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'subject' => $this->subject,
            'grade_level' => $this->grade_level,
            'max_students' => $this->max_students,
            'monthly_fee' => (float) $this->monthly_fee,
            'schedule_description' => $this->schedule_description,
            'is_active' => $this->is_active,
            'student_count' => $this->student_count ?? $this->activeStudents()->count(),
            'available_spots' => $this->max_students - ($this->student_count ?? $this->activeStudents()->count()),
            'students' => $this->when(
                $this->relationLoaded('activeStudents'),
                fn() => StudentResource::collection($this->activeStudents)
            ),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
