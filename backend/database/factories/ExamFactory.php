<?php

namespace Database\Factories;

use App\Models\Group;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExamFactory extends Factory
{
    public function definition(): array
    {
        $examDate = $this->faker->dateTimeBetween('-1 month', '+1 month');
        $totalMarks = $this->faker->randomElement([50, 100, 150, 200]);

        return [
            'group_id' => Group::factory(),
            'title' => $this->faker->randomElement([
                'اختبار الفصل الأول',
                'اختبار منتصف الفصل',
                'اختبار نهائي',
                'واجب منزلي',
                'اختبار قصير',
            ]),
            'description' => $this->faker->optional()->sentence(),
            'exam_date' => $examDate,
            'start_time' => $this->faker->time('H:i'),
            'duration_minutes' => $this->faker->randomElement([30, 45, 60, 90, 120]),
            'total_marks' => $totalMarks,
            'pass_marks' => $totalMarks * 0.6,
            'exam_type' => $this->faker->randomElement(['quiz', 'midterm', 'final', 'assignment']),
            'status' => 'scheduled',
            'instructions' => $this->faker->optional()->paragraph(),
            'is_published' => false,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
            'exam_date' => $this->faker->dateTimeBetween('now', '+1 month'),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'exam_date' => $this->faker->dateTimeBetween('-1 month', '-1 day'),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    public function quiz(): static
    {
        return $this->state(fn (array $attributes) => [
            'exam_type' => 'quiz',
            'total_marks' => 20,
            'duration_minutes' => 15,
        ]);
    }

    public function midterm(): static
    {
        return $this->state(fn (array $attributes) => [
            'exam_type' => 'midterm',
            'total_marks' => 100,
            'duration_minutes' => 90,
        ]);
    }

    public function final(): static
    {
        return $this->state(fn (array $attributes) => [
            'exam_type' => 'final',
            'total_marks' => 200,
            'duration_minutes' => 180,
        ]);
    }
}
