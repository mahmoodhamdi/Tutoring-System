<?php

namespace App\Enums;

enum AttendanceStatus: string
{
    case PRESENT = 'present';
    case ABSENT = 'absent';
    case LATE = 'late';
    case EXCUSED = 'excused';

    /**
     * Get the Arabic label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::PRESENT => 'حاضر',
            self::ABSENT => 'غائب',
            self::LATE => 'متأخر',
            self::EXCUSED => 'معذور',
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
            self::PRESENT => 'green',
            self::ABSENT => 'red',
            self::LATE => 'yellow',
            self::EXCUSED => 'blue',
        };
    }

    /**
     * Check if this status counts as attended.
     */
    public function isAttended(): bool
    {
        return in_array($this, [self::PRESENT, self::LATE]);
    }

    /**
     * Check if this status counts as missed.
     */
    public function isMissed(): bool
    {
        return $this === self::ABSENT;
    }

    /**
     * Check if this status is justified.
     */
    public function isJustified(): bool
    {
        return in_array($this, [self::PRESENT, self::LATE, self::EXCUSED]);
    }
}
