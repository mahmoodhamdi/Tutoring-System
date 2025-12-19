<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
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
            'session_id' => $this->session_id,
            'student_id' => $this->student_id,
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'check_in_time' => $this->check_in_time?->toISOString(),
            'notes' => $this->notes,
            'marked_by' => $this->marked_by,
            'session' => $this->when(
                $this->relationLoaded('session'),
                fn() => new SessionResource($this->session)
            ),
            'student' => $this->when(
                $this->relationLoaded('student'),
                fn() => [
                    'id' => $this->student->id,
                    'name' => $this->student->name,
                    'phone' => $this->student->phone,
                ]
            ),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get the status label in Arabic.
     */
    private function getStatusLabel(): string
    {
        return match ($this->status) {
            'present' => 'حاضر',
            'absent' => 'غائب',
            'late' => 'متأخر',
            'excused' => 'معذور',
            default => $this->status,
        };
    }
}
