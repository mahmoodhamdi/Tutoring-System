<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'group_id',
        'amount',
        'payment_date',
        'payment_method',
        'status',
        'period_month',
        'period_year',
        'notes',
        'receipt_number',
        'received_by',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
        'period_month' => 'integer',
        'period_year' => 'integer',
    ];

    /**
     * Get the student this payment belongs to.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the group this payment is for.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Get the user who received this payment.
     */
    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    /**
     * Scope for paid payments.
     */
    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    /**
     * Scope for pending payments.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for partial payments.
     */
    public function scopePartial($query)
    {
        return $query->where('status', 'partial');
    }

    /**
     * Scope for a specific period.
     */
    public function scopeForPeriod($query, int $month, int $year)
    {
        return $query->where('period_month', $month)->where('period_year', $year);
    }

    /**
     * Scope for payments by a student.
     */
    public function scopeByStudent($query, int $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    /**
     * Get the period as a formatted string.
     */
    public function getPeriodAttribute(): string
    {
        $months = [
            1 => 'يناير', 2 => 'فبراير', 3 => 'مارس', 4 => 'أبريل',
            5 => 'مايو', 6 => 'يونيو', 7 => 'يوليو', 8 => 'أغسطس',
            9 => 'سبتمبر', 10 => 'أكتوبر', 11 => 'نوفمبر', 12 => 'ديسمبر',
        ];

        return $months[$this->period_month] . ' ' . $this->period_year;
    }

    /**
     * Generate a receipt number.
     */
    public static function generateReceiptNumber(): string
    {
        $prefix = 'RCP';
        $date = now()->format('Ymd');
        $random = str_pad(random_int(1, 9999), 4, '0', STR_PAD_LEFT);

        return "{$prefix}-{$date}-{$random}";
    }
}
