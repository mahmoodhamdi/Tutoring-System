<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'group_id' => $this->group_id,
            'title' => $this->title,
            'description' => $this->description,
            'exam_date' => $this->exam_date->format('Y-m-d'),
            'start_time' => $this->start_time?->format('H:i'),
            'duration_minutes' => $this->duration_minutes,
            'total_marks' => (float) $this->total_marks,
            'pass_marks' => $this->pass_marks ? (float) $this->pass_marks : null,
            'exam_type' => $this->exam_type,
            'exam_type_label' => $this->exam_type_label,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'instructions' => $this->instructions,
            'is_published' => $this->is_published,
            'is_past' => $this->is_past,
            'is_upcoming' => $this->is_upcoming,
            'can_be_edited' => $this->canBeEdited(),
            'results_count' => $this->results_count,
            'graded_count' => $this->graded_count,
            'average_marks' => $this->average_marks,
            'average_percentage' => $this->average_percentage,
            'pass_rate' => $this->pass_rate,
            'group' => new GroupResource($this->whenLoaded('group')),
            'results' => ExamResultResource::collection($this->whenLoaded('results')),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
