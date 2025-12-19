<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizAnswerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'attempt_id' => $this->attempt_id,
            'question_id' => $this->question_id,
            'selected_option_id' => $this->selected_option_id,
            'answer_text' => $this->answer_text,
            'is_correct' => $this->is_correct,
            'marks_obtained' => $this->marks_obtained ? (float) $this->marks_obtained : null,
            'question' => new QuizQuestionResource($this->whenLoaded('question')),
            'selected_option' => new QuizOptionResource($this->whenLoaded('selectedOption')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
