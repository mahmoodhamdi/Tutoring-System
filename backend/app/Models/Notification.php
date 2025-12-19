<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    // Notification Types
    public const TYPE_SESSION_REMINDER = 'session_reminder';
    public const TYPE_SESSION_CANCELLED = 'session_cancelled';
    public const TYPE_PAYMENT_DUE = 'payment_due';
    public const TYPE_PAYMENT_RECEIVED = 'payment_received';
    public const TYPE_PAYMENT_OVERDUE = 'payment_overdue';
    public const TYPE_EXAM_REMINDER = 'exam_reminder';
    public const TYPE_EXAM_RESULT = 'exam_result';
    public const TYPE_QUIZ_AVAILABLE = 'quiz_available';
    public const TYPE_QUIZ_RESULT = 'quiz_result';
    public const TYPE_ANNOUNCEMENT = 'announcement';
    public const TYPE_ATTENDANCE_MARKED = 'attendance_marked';
    public const TYPE_GROUP_ADDED = 'group_added';
    public const TYPE_GENERAL = 'general';

    // Relationships

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // Accessors

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            self::TYPE_SESSION_REMINDER => 'تذكير بالحصة',
            self::TYPE_SESSION_CANCELLED => 'إلغاء حصة',
            self::TYPE_PAYMENT_DUE => 'موعد دفع',
            self::TYPE_PAYMENT_RECEIVED => 'استلام دفعة',
            self::TYPE_PAYMENT_OVERDUE => 'دفعة متأخرة',
            self::TYPE_EXAM_REMINDER => 'تذكير باختبار',
            self::TYPE_EXAM_RESULT => 'نتيجة اختبار',
            self::TYPE_QUIZ_AVAILABLE => 'كويز متاح',
            self::TYPE_QUIZ_RESULT => 'نتيجة كويز',
            self::TYPE_ANNOUNCEMENT => 'إعلان',
            self::TYPE_ATTENDANCE_MARKED => 'تسجيل حضور',
            self::TYPE_GROUP_ADDED => 'إضافة لمجموعة',
            self::TYPE_GENERAL => 'إشعار عام',
            default => $this->type,
        };
    }

    public function getIconAttribute(): string
    {
        return match ($this->type) {
            self::TYPE_SESSION_REMINDER, self::TYPE_SESSION_CANCELLED => 'CalendarIcon',
            self::TYPE_PAYMENT_DUE, self::TYPE_PAYMENT_RECEIVED, self::TYPE_PAYMENT_OVERDUE => 'CurrencyDollarIcon',
            self::TYPE_EXAM_REMINDER, self::TYPE_EXAM_RESULT => 'AcademicCapIcon',
            self::TYPE_QUIZ_AVAILABLE, self::TYPE_QUIZ_RESULT => 'ClipboardDocumentListIcon',
            self::TYPE_ANNOUNCEMENT => 'MegaphoneIcon',
            self::TYPE_ATTENDANCE_MARKED => 'CheckCircleIcon',
            self::TYPE_GROUP_ADDED => 'UserGroupIcon',
            default => 'BellIcon',
        };
    }

    // Methods

    public function markAsRead(): bool
    {
        $this->is_read = true;
        $this->read_at = now();
        return $this->save();
    }

    public function markAsUnread(): bool
    {
        $this->is_read = false;
        $this->read_at = null;
        return $this->save();
    }

    // Static factory methods for creating notifications

    public static function createSessionReminder(User $user, $session): self
    {
        return self::create([
            'user_id' => $user->id,
            'type' => self::TYPE_SESSION_REMINDER,
            'title' => 'تذكير بالحصة',
            'message' => "لديك حصة قادمة: {$session->title}",
            'data' => [
                'session_id' => $session->id,
                'link' => "/dashboard/schedule/{$session->id}",
            ],
        ]);
    }

    public static function createPaymentDue(User $user, $payment): self
    {
        return self::create([
            'user_id' => $user->id,
            'type' => self::TYPE_PAYMENT_DUE,
            'title' => 'موعد دفع',
            'message' => "لديك دفعة مستحقة بقيمة {$payment->amount}",
            'data' => [
                'payment_id' => $payment->id,
                'link' => "/dashboard/payments/{$payment->id}",
            ],
        ]);
    }

    public static function createExamReminder(User $user, $exam): self
    {
        return self::create([
            'user_id' => $user->id,
            'type' => self::TYPE_EXAM_REMINDER,
            'title' => 'تذكير باختبار',
            'message' => "لديك اختبار قادم: {$exam->title}",
            'data' => [
                'exam_id' => $exam->id,
                'link' => "/dashboard/exams/{$exam->id}",
            ],
        ]);
    }

    public static function createAnnouncement(User $user, $announcement): self
    {
        return self::create([
            'user_id' => $user->id,
            'type' => self::TYPE_ANNOUNCEMENT,
            'title' => 'إعلان جديد',
            'message' => $announcement->title,
            'data' => [
                'announcement_id' => $announcement->id,
                'link' => "/dashboard/announcements/{$announcement->id}",
            ],
        ]);
    }

    public static function createGeneral(User $user, string $title, string $message, array $data = []): self
    {
        return self::create([
            'user_id' => $user->id,
            'type' => self::TYPE_GENERAL,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }
}
