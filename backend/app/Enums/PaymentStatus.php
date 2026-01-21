<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case PAID = 'paid';
    case PENDING = 'pending';
    case PARTIAL = 'partial';
    case OVERDUE = 'overdue';
    case CANCELLED = 'cancelled';

    /**
     * Get the Arabic label for the status.
     */
    public function label(): string
    {
        return match ($this) {
            self::PAID => 'مدفوع',
            self::PENDING => 'قيد الانتظار',
            self::PARTIAL => 'دفع جزئي',
            self::OVERDUE => 'متأخر',
            self::CANCELLED => 'ملغي',
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
            self::PAID => 'green',
            self::PENDING => 'yellow',
            self::PARTIAL => 'orange',
            self::OVERDUE => 'red',
            self::CANCELLED => 'gray',
        };
    }

    /**
     * Check if this status indicates payment is complete.
     */
    public function isComplete(): bool
    {
        return $this === self::PAID;
    }

    /**
     * Check if this status requires action.
     */
    public function requiresAction(): bool
    {
        return in_array($this, [self::PENDING, self::PARTIAL, self::OVERDUE]);
    }
}
