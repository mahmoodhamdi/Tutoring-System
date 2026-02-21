<?php

namespace App\Enums;

enum QuizAttemptStatus: string
{
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case TIMED_OUT = 'timed_out';
    case ABANDONED = 'abandoned';
    case GRADED = 'graded';

    /**
     * Get the Arabic label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::IN_PROGRESS => 'قيد التنفيذ',
            self::COMPLETED => 'مكتمل',
            self::TIMED_OUT => 'انتهى الوقت',
            self::ABANDONED => 'متروك',
            self::GRADED => 'تم التصحيح',
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
            self::IN_PROGRESS => 'blue',
            self::COMPLETED => 'green',
            self::TIMED_OUT => 'orange',
            self::ABANDONED => 'gray',
            self::GRADED => 'purple',
        };
    }

    /**
     * Check if the attempt is finished.
     */
    public function isFinished(): bool
    {
        return in_array($this, [self::COMPLETED, self::TIMED_OUT, self::ABANDONED, self::GRADED]);
    }

    /**
     * Check if the attempt counts toward the limit.
     */
    public function countsTowardLimit(): bool
    {
        return in_array($this, [self::COMPLETED, self::TIMED_OUT, self::GRADED]);
    }

    /**
     * Check if the attempt can be continued.
     */
    public function canContinue(): bool
    {
        return $this === self::IN_PROGRESS;
    }

    /**
     * Check if the attempt has a valid score.
     */
    public function hasScore(): bool
    {
        return in_array($this, [self::COMPLETED, self::TIMED_OUT, self::GRADED]);
    }
}
