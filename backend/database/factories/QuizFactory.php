<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quiz>
 */
class QuizFactory extends Factory
{
    protected $model = Quiz::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $availableFrom = fake()->optional()->dateTimeBetween('-1 week', '+1 week');
        $availableUntil = $availableFrom
            ? fake()->dateTimeBetween($availableFrom, '+2 weeks')
            : null;

        return [
            'group_id' => Group::factory(),
            'title' => fake()->randomElement([
                'اختبار ' . fake()->word(),
                'مراجعة الوحدة ' . fake()->numberBetween(1, 10),
                'تقييم ' . fake()->word(),
            ]),
            'description' => fake()->optional()->paragraph(),
            'instructions' => fake()->optional()->paragraph(),
            'duration_minutes' => fake()->randomElement([15, 30, 45, 60, 90, 120]),
            'total_marks' => 0, // Will be calculated from questions
            'pass_percentage' => fake()->randomElement([50, 60, 70, 80]),
            'max_attempts' => fake()->randomElement([1, 2, 3]),
            'shuffle_questions' => fake()->boolean(30),
            'shuffle_answers' => fake()->boolean(30),
            'show_correct_answers' => fake()->boolean(70),
            'show_score_immediately' => fake()->boolean(80),
            'available_from' => $availableFrom,
            'available_until' => $availableUntil,
            'is_published' => fake()->boolean(50),
        ];
    }

    /**
     * Indicate that the quiz is published.
     */
    public function published(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => true,
            'available_from' => now()->subDay(),
            'available_until' => now()->addWeek(),
        ]);
    }

    /**
     * Indicate that the quiz is unpublished.
     */
    public function unpublished(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => false,
        ]);
    }

    /**
     * Indicate that the quiz is available now.
     */
    public function available(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => true,
            'available_from' => now()->subHour(),
            'available_until' => now()->addWeek(),
        ]);
    }

    /**
     * Indicate that the quiz has expired.
     */
    public function expired(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => true,
            'available_from' => now()->subWeek(),
            'available_until' => now()->subDay(),
        ]);
    }

    /**
     * Indicate that the quiz is scheduled for the future.
     */
    public function scheduled(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => true,
            'available_from' => now()->addDay(),
            'available_until' => now()->addWeek(),
        ]);
    }

    /**
     * Create quiz with questions.
     */
    public function withQuestions(int $count = 5): static
    {
        return $this->afterCreating(function (Quiz $quiz) use ($count) {
            \App\Models\QuizQuestion::factory()
                ->count($count)
                ->multipleChoice()
                ->for($quiz)
                ->create();

            $quiz->recalculateTotalMarks();
        });
    }
}
