<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizOptionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Hide is_correct for students during quiz attempt
        $showCorrectAnswer = true;

        // Check if this is a quiz taking context (student attempting quiz)
        $routeName = $request->route()?->getName();
        if (in_array($routeName, ['quizzes.start-attempt', 'quizzes.student-attempts'])) {
            $showCorrectAnswer = false;
        }

        return [
            'id' => $this->id,
            'question_id' => $this->question_id,
            'option_text' => $this->option_text,
            'is_correct' => $this->when($showCorrectAnswer, $this->is_correct),
            'order_index' => $this->order_index,
        ];
    }
}
