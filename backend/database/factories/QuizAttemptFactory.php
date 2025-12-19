<?php

namespace Database\Factories;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuizAttempt>
 */
class QuizAttemptFactory extends Factory
{
    protected $model = QuizAttempt::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'quiz_id' => Quiz::factory(),
            'student_id' => User::factory(),
            'started_at' => now(),
            'completed_at' => null,
            'score' => null,
            'percentage' => null,
            'is_passed' => null,
            'time_taken_seconds' => null,
            'status' => 'in_progress',
        ];
    }

    /**
     * Indicate that the attempt is in progress.
     */
    public function inProgress(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'in_progress',
            'started_at' => now()->subMinutes(fake()->numberBetween(1, 30)),
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the attempt is completed.
     */
    public function completed(): static
    {
        $startedAt = now()->subMinutes(fake()->numberBetween(10, 60));
        $completedAt = $startedAt->copy()->addMinutes(fake()->numberBetween(5, 45));
        $timeTaken = $startedAt->diffInSeconds($completedAt);
        $percentage = fake()->numberBetween(30, 100);

        return $this->state(fn(array $attributes) => [
            'status' => 'completed',
            'started_at' => $startedAt,
            'completed_at' => $completedAt,
            'time_taken_seconds' => $timeTaken,
            'score' => fake()->randomFloat(2, 0, 100),
            'percentage' => $percentage,
            'is_passed' => $percentage >= 60,
        ]);
    }

    /**
     * Indicate that the attempt timed out.
     */
    public function timedOut(): static
    {
        $percentage = fake()->numberBetween(10, 60);

        return $this->state(fn(array $attributes) => [
            'status' => 'timed_out',
            'started_at' => now()->subMinutes(60),
            'completed_at' => now(),
            'time_taken_seconds' => 3600,
            'score' => fake()->randomFloat(2, 0, 50),
            'percentage' => $percentage,
            'is_passed' => $percentage >= 60,
        ]);
    }

    /**
     * Indicate that the attempt was abandoned.
     */
    public function abandoned(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'abandoned',
            'started_at' => now()->subHours(2),
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the student passed.
     */
    public function passed(): static
    {
        return $this->completed()->state(fn(array $attributes) => [
            'percentage' => fake()->numberBetween(60, 100),
            'is_passed' => true,
        ]);
    }

    /**
     * Indicate that the student failed.
     */
    public function failed(): static
    {
        return $this->completed()->state(fn(array $attributes) => [
            'percentage' => fake()->numberBetween(0, 59),
            'is_passed' => false,
        ]);
    }
}
