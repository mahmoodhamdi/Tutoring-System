<?php

namespace Database\Factories;

use App\Models\Announcement;
use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Announcement>
 */
class AnnouncementFactory extends Factory
{
    protected $model = Announcement::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $isPublished = fake()->boolean(70);

        return [
            'user_id' => User::factory(),
            'group_id' => fake()->optional(0.5)->passthrough(Group::factory()),
            'title' => fake()->randomElement([
                'إعلان هام',
                'تنبيه مهم',
                'تحديث الجدول',
                'موعد الاختبار',
                'إجازة رسمية',
                'تغيير في المواعيد',
            ]),
            'content' => fake()->paragraphs(rand(1, 3), true),
            'priority' => fake()->randomElement(['low', 'normal', 'high', 'urgent']),
            'type' => fake()->randomElement(['general', 'schedule', 'exam', 'payment', 'event']),
            'is_pinned' => fake()->boolean(20),
            'is_published' => $isPublished,
            'published_at' => $isPublished ? fake()->dateTimeBetween('-1 month', 'now') : null,
            'expires_at' => fake()->optional(0.3)->dateTimeBetween('now', '+1 month'),
        ];
    }

    /**
     * Indicate that the announcement is published.
     */
    public function published(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => true,
            'published_at' => now(),
        ]);
    }

    /**
     * Indicate that the announcement is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => false,
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the announcement is pinned.
     */
    public function pinned(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_pinned' => true,
        ]);
    }

    /**
     * Indicate that the announcement is urgent.
     */
    public function urgent(): static
    {
        return $this->state(fn(array $attributes) => [
            'priority' => 'urgent',
        ]);
    }

    /**
     * Indicate that the announcement is expired.
     */
    public function expired(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_published' => true,
            'published_at' => now()->subWeek(),
            'expires_at' => now()->subDay(),
        ]);
    }

    /**
     * Set announcement type.
     */
    public function ofType(string $type): static
    {
        return $this->state(fn(array $attributes) => [
            'type' => $type,
        ]);
    }

    /**
     * Set announcement priority.
     */
    public function withPriority(string $priority): static
    {
        return $this->state(fn(array $attributes) => [
            'priority' => $priority,
        ]);
    }

    /**
     * Set specific group.
     */
    public function forGroup(Group $group): static
    {
        return $this->state(fn(array $attributes) => [
            'group_id' => $group->id,
        ]);
    }

    /**
     * Global announcement (no specific group).
     */
    public function global(): static
    {
        return $this->state(fn(array $attributes) => [
            'group_id' => null,
        ]);
    }
}
