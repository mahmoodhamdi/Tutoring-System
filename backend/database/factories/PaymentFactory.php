<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'student_id' => User::factory()->state(['role' => 'student']),
            'group_id' => Group::factory(),
            'amount' => $this->faker->randomFloat(2, 100, 500),
            'payment_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'payment_method' => $this->faker->randomElement(['cash', 'bank_transfer', 'online']),
            'status' => $this->faker->randomElement(['paid', 'pending', 'partial']),
            'period_month' => $this->faker->numberBetween(1, 12),
            'period_year' => now()->year,
            'notes' => $this->faker->optional()->sentence(),
            'receipt_number' => Payment::generateReceiptNumber(),
            'received_by' => User::factory()->state(['role' => 'teacher']),
        ];
    }

    /**
     * Indicate that the payment is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
        ]);
    }

    /**
     * Indicate that the payment is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the payment is partial.
     */
    public function partial(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'partial',
        ]);
    }

    /**
     * Set a specific period.
     */
    public function forPeriod(int $month, int $year): static
    {
        return $this->state(fn (array $attributes) => [
            'period_month' => $month,
            'period_year' => $year,
        ]);
    }

    /**
     * Set cash payment method.
     */
    public function cash(): static
    {
        return $this->state(fn (array $attributes) => [
            'payment_method' => 'cash',
        ]);
    }
}
