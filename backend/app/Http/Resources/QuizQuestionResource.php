<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizQuestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quiz_id' => $this->quiz_id,
            'question_text' => $this->question_text,
            'question_type' => $this->question_type,
            'question_type_label' => $this->question_type_label,
            'marks' => (float) $this->marks,
            'order_index' => $this->order_index,
            'explanation' => $this->explanation,
            'options' => QuizOptionResource::collection($this->whenLoaded('options')),
            'correct_option' => new QuizOptionResource($this->whenLoaded('correctOption')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
