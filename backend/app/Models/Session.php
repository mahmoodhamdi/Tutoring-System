<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Session extends Model
{
    use HasFactory;

    protected $table = 'tutoring_sessions';

    protected $attributes = [
        'status' => 'scheduled',
    ];

    protected $fillable = [
        'group_id',
        'session_date',
        'start_time',
        'end_time',
        'topic',
        'title',
        'description',
        'scheduled_at',
        'duration_minutes',
        'status',
        'location',
        'notes',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'session_date' => 'date',
        'scheduled_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'duration_minutes' => 'integer',
    ];

    /**
     * Get the group this session belongs to.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Get the attendance records for this session.
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Scope for scheduled sessions.
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    /**
     * Scope for completed sessions.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope for cancelled sessions.
     */
    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    /**
     * Scope for sessions on a specific date.
     */
    public function scopeOnDate($query, $date)
    {
        return $query->whereDate('scheduled_at', $date);
    }

    /**
     * Scope for sessions in a date range.
     */
    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('scheduled_at', [$startDate, $endDate]);
    }

    /**
     * Scope for upcoming sessions.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_at', '>=', now())
            ->where('status', 'scheduled')
            ->orderBy('scheduled_at');
    }

    /**
     * Scope for today's sessions.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('scheduled_at', today());
    }

    /**
     * Scope for this week's sessions.
     */
    public function scopeThisWeek($query)
    {
        return $query->whereBetween('scheduled_at', [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ]);
    }

    /**
     * Get the end time of the session.
     */
    public function getEndTimeAttribute()
    {
        return $this->scheduled_at?->copy()->addMinutes($this->duration_minutes ?? 60);
    }

    /**
     * Check if the session is in the past.
     */
    public function isPast(): bool
    {
        return $this->scheduled_at?->isPast() ?? false;
    }

    /**
     * Check if the session is upcoming.
     */
    public function isUpcoming(): bool
    {
        return ($this->scheduled_at?->isFuture() ?? false) && $this->status === 'scheduled';
    }

    /**
     * Cancel the session.
     */
    public function cancel(?string $reason = null): void
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);
    }

    /**
     * Mark the session as completed.
     */
    public function complete(): void
    {
        $this->update(['status' => 'completed']);
    }
}
