<?php

namespace Database\Factories;

use App\Models\Group;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Group>
 */
class GroupFactory extends Factory
{
    protected $model = Group::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subjects = ['الرياضيات', 'اللغة العربية', 'اللغة الإنجليزية', 'العلوم', 'الفيزياء', 'الكيمياء'];
        $gradeLevels = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'];

        return [
            'name' => $this->faker->randomElement($subjects) . ' - ' . $this->faker->randomElement($gradeLevels),
            'description' => $this->faker->optional()->sentence(),
            'subject' => $this->faker->randomElement($subjects),
            'grade_level' => $this->faker->randomElement($gradeLevels),
            'max_students' => $this->faker->numberBetween(10, 25),
            'monthly_fee' => $this->faker->randomFloat(2, 100, 500),
            'schedule_description' => $this->faker->optional()->sentence(),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the group is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the group is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Set a specific subject.
     */
    public function subject(string $subject): static
    {
        return $this->state(fn (array $attributes) => [
            'subject' => $subject,
        ]);
    }

    /**
     * Set a specific grade level.
     */
    public function gradeLevel(string $gradeLevel): static
    {
        return $this->state(fn (array $attributes) => [
            'grade_level' => $gradeLevel,
        ]);
    }

    /**
     * Set the max students.
     */
    public function maxStudents(int $max): static
    {
        return $this->state(fn (array $attributes) => [
            'max_students' => $max,
        ]);
    }
}
