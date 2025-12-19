<?php

namespace Database\Factories;

use App\Models\QuizAnswer;
use App\Models\QuizAttempt;
use App\Models\QuizOption;
use App\Models\QuizQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuizAnswer>
 */
class QuizAnswerFactory extends Factory
{
    protected $model = QuizAnswer::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'attempt_id' => QuizAttempt::factory(),
            'question_id' => QuizQuestion::factory(),
            'selected_option_id' => null,
            'answer_text' => null,
            'is_correct' => false,
            'marks_obtained' => 0,
        ];
    }

    /**
     * Indicate that the answer is correct.
     */
    public function correct(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_correct' => true,
            'marks_obtained' => fake()->randomFloat(2, 1, 10),
        ]);
    }

    /**
     * Indicate that the answer is incorrect.
     */
    public function incorrect(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_correct' => false,
            'marks_obtained' => 0,
        ]);
    }

    /**
     * Set a selected option.
     */
    public function withOption(QuizOption $option = null): static
    {
        return $this->state(fn(array $attributes) => [
            'selected_option_id' => $option?->id ?? QuizOption::factory(),
        ]);
    }

    /**
     * Set a text answer.
     */
    public function withText(string $text = null): static
    {
        return $this->state(fn(array $attributes) => [
            'answer_text' => $text ?? fake()->paragraph(),
        ]);
    }
}
