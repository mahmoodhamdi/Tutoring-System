<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'group_id' => $this->group_id,
            'title' => $this->title,
            'description' => $this->description,
            'instructions' => $this->instructions,
            'duration_minutes' => $this->duration_minutes,
            'total_marks' => (float) $this->total_marks,
            'pass_percentage' => (float) $this->pass_percentage,
            'max_attempts' => $this->max_attempts,
            'shuffle_questions' => $this->shuffle_questions,
            'shuffle_answers' => $this->shuffle_answers,
            'show_correct_answers' => $this->show_correct_answers,
            'show_score_immediately' => $this->show_score_immediately,
            'available_from' => $this->available_from?->toISOString(),
            'available_until' => $this->available_until?->toISOString(),
            'is_published' => $this->is_published,
            'is_available' => $this->is_available,
            'questions_count' => $this->questions_count,
            'attempts_count' => $this->attempts_count,
            'completed_attempts_count' => $this->completed_attempts_count,
            'average_score' => $this->average_score,
            'average_percentage' => $this->average_percentage,
            'group' => new GroupResource($this->whenLoaded('group')),
            'questions' => QuizQuestionResource::collection($this->whenLoaded('questions')),
            'attempts' => QuizAttemptResource::collection($this->whenLoaded('attempts')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
