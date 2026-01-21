<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case TEACHER = 'teacher';
    case STUDENT = 'student';
    case PARENT = 'parent';

    /**
     * Get the Arabic label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'مدير النظام',
            self::TEACHER => 'معلم',
            self::STUDENT => 'طالب',
            self::PARENT => 'ولي أمر',
        };
    }

    /**
     * Get all roles as array for validation.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Check if this role can manage students.
     */
    public function canManageStudents(): bool
    {
        return in_array($this, [self::ADMIN, self::TEACHER]);
    }

    /**
     * Check if this role can manage groups.
     */
    public function canManageGroups(): bool
    {
        return in_array($this, [self::ADMIN, self::TEACHER]);
    }

    /**
     * Check if this role can view reports.
     */
    public function canViewReports(): bool
    {
        return in_array($this, [self::ADMIN, self::TEACHER]);
    }

    /**
     * Check if this role can access admin panel.
     */
    public function canAccessAdmin(): bool
    {
        return in_array($this, [self::ADMIN, self::TEACHER]);
    }

    /**
     * Check if this role can access portal.
     */
    public function canAccessPortal(): bool
    {
        return in_array($this, [self::STUDENT, self::PARENT]);
    }
}
