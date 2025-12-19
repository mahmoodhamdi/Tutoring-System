<?php

namespace Database\Factories;

use App\Models\QuizOption;
use App\Models\QuizQuestion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuizOption>
 */
class QuizOptionFactory extends Factory
{
    protected $model = QuizOption::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'question_id' => QuizQuestion::factory(),
            'option_text' => fake()->sentence(),
            'is_correct' => false,
            'order_index' => 1,
        ];
    }

    /**
     * Mark option as correct.
     */
    public function correct(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_correct' => true,
        ]);
    }

    /**
     * Mark option as incorrect.
     */
    public function incorrect(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_correct' => false,
        ]);
    }
}
