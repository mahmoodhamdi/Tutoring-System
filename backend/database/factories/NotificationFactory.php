<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = [
            Notification::TYPE_SESSION_REMINDER,
            Notification::TYPE_PAYMENT_DUE,
            Notification::TYPE_EXAM_REMINDER,
            Notification::TYPE_ANNOUNCEMENT,
            Notification::TYPE_GENERAL,
        ];

        $type = fake()->randomElement($types);
        $isRead = fake()->boolean(30);

        return [
            'user_id' => User::factory(),
            'type' => $type,
            'title' => $this->getTitleForType($type),
            'message' => fake()->sentence(),
            'data' => null,
            'is_read' => $isRead,
            'read_at' => $isRead ? fake()->dateTimeBetween('-1 week', 'now') : null,
        ];
    }

    /**
     * Get title based on notification type.
     */
    protected function getTitleForType(string $type): string
    {
        return match ($type) {
            Notification::TYPE_SESSION_REMINDER => 'تذكير بالحصة',
            Notification::TYPE_SESSION_CANCELLED => 'إلغاء حصة',
            Notification::TYPE_PAYMENT_DUE => 'موعد دفع',
            Notification::TYPE_PAYMENT_RECEIVED => 'استلام دفعة',
            Notification::TYPE_PAYMENT_OVERDUE => 'دفعة متأخرة',
            Notification::TYPE_EXAM_REMINDER => 'تذكير باختبار',
            Notification::TYPE_EXAM_RESULT => 'نتيجة اختبار',
            Notification::TYPE_QUIZ_AVAILABLE => 'كويز متاح',
            Notification::TYPE_QUIZ_RESULT => 'نتيجة كويز',
            Notification::TYPE_ANNOUNCEMENT => 'إعلان جديد',
            Notification::TYPE_ATTENDANCE_MARKED => 'تسجيل حضور',
            Notification::TYPE_GROUP_ADDED => 'إضافة لمجموعة',
            default => 'إشعار',
        };
    }

    /**
     * Indicate that the notification is unread.
     */
    public function unread(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_read' => false,
            'read_at' => null,
        ]);
    }

    /**
     * Indicate that the notification is read.
     */
    public function read(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Set notification type.
     */
    public function ofType(string $type): static
    {
        return $this->state(fn(array $attributes) => [
            'type' => $type,
            'title' => $this->getTitleForType($type),
        ]);
    }

    /**
     * Session reminder notification.
     */
    public function sessionReminder(): static
    {
        return $this->ofType(Notification::TYPE_SESSION_REMINDER);
    }

    /**
     * Payment due notification.
     */
    public function paymentDue(): static
    {
        return $this->ofType(Notification::TYPE_PAYMENT_DUE);
    }

    /**
     * Exam reminder notification.
     */
    public function examReminder(): static
    {
        return $this->ofType(Notification::TYPE_EXAM_REMINDER);
    }

    /**
     * Announcement notification.
     */
    public function announcement(): static
    {
        return $this->ofType(Notification::TYPE_ANNOUNCEMENT);
    }

    /**
     * General notification.
     */
    public function general(): static
    {
        return $this->ofType(Notification::TYPE_GENERAL);
    }
}
