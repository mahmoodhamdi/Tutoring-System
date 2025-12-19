<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionResource extends JsonResource
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
            'group_id' => $this->group_id,
            'title' => $this->title,
            'description' => $this->description,
            'scheduled_at' => $this->scheduled_at?->toISOString(),
            'end_time' => $this->end_time?->toISOString(),
            'duration_minutes' => $this->duration_minutes,
            'status' => $this->status,
            'location' => $this->location,
            'notes' => $this->notes,
            'cancelled_at' => $this->cancelled_at?->toISOString(),
            'cancellation_reason' => $this->cancellation_reason,
            'is_past' => $this->isPast(),
            'is_upcoming' => $this->isUpcoming(),
            'group' => $this->when(
                $this->relationLoaded('group'),
                fn() => new GroupResource($this->group)
            ),
            'attendances' => $this->when(
                $this->relationLoaded('attendances'),
                fn() => AttendanceResource::collection($this->attendances)
            ),
            'attendance_count' => $this->when(
                $this->relationLoaded('attendances'),
                fn() => $this->attendances->count()
            ),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
