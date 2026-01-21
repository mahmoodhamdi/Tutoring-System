<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\Session;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['present', 'absent', 'late', 'excused']);

        return [
            'session_id' => Session::factory(),
            'student_id' => User::factory()->state(['role' => 'student']),
            'status' => $status,
            'check_in_time' => in_array($status, ['present', 'late']) ? $this->faker->dateTimeThisMonth() : null,
            'notes' => $this->faker->optional()->sentence(),
            'marked_by' => User::factory()->state(['role' => 'teacher']),
        ];
    }

    /**
     * Indicate that the student is present.
     */
    public function present(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'present',
            'check_in_time' => now(),
        ]);
    }

    /**
     * Indicate that the student is absent.
     */
    public function absent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'absent',
            'check_in_time' => null,
        ]);
    }

    /**
     * Indicate that the student is late.
     */
    public function late(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'late',
            'check_in_time' => now(),
        ]);
    }

    /**
     * Indicate that the student is excused.
     */
    public function excused(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'excused',
            'check_in_time' => null,
        ]);
    }
}
