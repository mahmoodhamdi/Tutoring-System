<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'student_id',
        'status',
        'check_in_time',
        'notes',
        'marked_by',
    ];

    protected $casts = [
        'check_in_time' => 'datetime',
    ];

    /**
     * Get the session this attendance belongs to.
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    /**
     * Get the student this attendance belongs to.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the user who marked this attendance.
     */
    public function markedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_by');
    }

    /**
     * Scope for present students.
     */
    public function scopePresent($query)
    {
        return $query->where('status', 'present');
    }

    /**
     * Scope for absent students.
     */
    public function scopeAbsent($query)
    {
        return $query->where('status', 'absent');
    }

    /**
     * Scope for late students.
     */
    public function scopeLate($query)
    {
        return $query->where('status', 'late');
    }

    /**
     * Scope for excused students.
     */
    public function scopeExcused($query)
    {
        return $query->where('status', 'excused');
    }

    /**
     * Check if the student is present (including late).
     */
    public function isPresent(): bool
    {
        return in_array($this->status, ['present', 'late']);
    }
}
