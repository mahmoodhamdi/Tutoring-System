<?php

namespace App\Enums;

enum SessionStatus: string
{
    case SCHEDULED = 'scheduled';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case IN_PROGRESS = 'in_progress';

    /**
     * Get the Arabic label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::SCHEDULED => 'مجدول',
            self::COMPLETED => 'مكتمل',
            self::CANCELLED => 'ملغي',
            self::IN_PROGRESS => 'جاري',
        };
    }

    /**
     * Get all statuses as array for validation.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the color class for UI display.
     */
    public function color(): string
    {
        return match ($this) {
            self::SCHEDULED => 'blue',
            self::COMPLETED => 'green',
            self::CANCELLED => 'red',
            self::IN_PROGRESS => 'yellow',
        };
    }

    /**
     * Check if attendance can be recorded.
     */
    public function canRecordAttendance(): bool
    {
        return in_array($this, [self::SCHEDULED, self::IN_PROGRESS, self::COMPLETED]);
    }

    /**
     * Check if session can be cancelled.
     */
    public function canBeCancelled(): bool
    {
        return in_array($this, [self::SCHEDULED, self::IN_PROGRESS]);
    }

    /**
     * Check if session is active.
     */
    public function isActive(): bool
    {
        return in_array($this, [self::SCHEDULED, self::IN_PROGRESS]);
    }
}
