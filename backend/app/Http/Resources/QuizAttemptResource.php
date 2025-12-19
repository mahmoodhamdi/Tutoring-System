<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizAttemptResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quiz_id' => $this->quiz_id,
            'student_id' => $this->student_id,
            'started_at' => $this->started_at?->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'score' => $this->score ? (float) $this->score : null,
            'percentage' => $this->percentage ? (float) $this->percentage : null,
            'is_passed' => $this->is_passed,
            'time_taken_seconds' => $this->time_taken_seconds,
            'time_remaining_seconds' => $this->time_remaining_seconds,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'is_timed_out' => $this->is_timed_out,
            'correct_answers_count' => $this->correct_answers_count,
            'total_questions' => $this->total_questions,
            'quiz' => new QuizResource($this->whenLoaded('quiz')),
            'student' => new UserResource($this->whenLoaded('student')),
            'answers' => QuizAnswerResource::collection($this->whenLoaded('answers')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
