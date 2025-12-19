<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Session;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Session>
 */
class SessionFactory extends Factory
{
    protected $model = Session::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'group_id' => Group::factory(),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->optional()->paragraph(),
            'scheduled_at' => $this->faker->dateTimeBetween('now', '+1 month'),
            'duration_minutes' => $this->faker->randomElement([60, 90, 120]),
            'status' => 'scheduled',
            'location' => $this->faker->optional()->address(),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the session is scheduled.
     */
    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
            'scheduled_at' => $this->faker->dateTimeBetween('now', '+1 month'),
        ]);
    }

    /**
     * Indicate that the session is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'scheduled_at' => $this->faker->dateTimeBetween('-1 month', '-1 day'),
        ]);
    }

    /**
     * Indicate that the session is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $this->faker->sentence(),
        ]);
    }

    /**
     * Set the session for today.
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'scheduled_at' => now()->setTime(
                $this->faker->numberBetween(8, 20),
                $this->faker->randomElement([0, 30]),
                0
            ),
        ]);
    }

    /**
     * Set the session for a specific group.
     */
    public function forGroup(Group $group): static
    {
        return $this->state(fn (array $attributes) => [
            'group_id' => $group->id,
        ]);
    }
}
