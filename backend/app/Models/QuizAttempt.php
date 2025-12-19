<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizAttempt extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'student_id',
        'started_at',
        'completed_at',
        'score',
        'percentage',
        'is_passed',
        'time_taken_seconds',
        'status',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'score' => 'decimal:2',
        'percentage' => 'decimal:2',
        'is_passed' => 'boolean',
        'time_taken_seconds' => 'integer',
    ];

    // Relationships

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class, 'attempt_id');
    }

    // Scopes

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopePassed($query)
    {
        return $query->where('is_passed', true);
    }

    public function scopeFailed($query)
    {
        return $query->where('is_passed', false);
    }

    // Accessors

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'in_progress' => 'قيد التنفيذ',
            'completed' => 'مكتمل',
            'timed_out' => 'انتهى الوقت',
            'abandoned' => 'متروك',
            default => $this->status,
        };
    }

    public function getTimeRemainingSecondsAttribute(): ?int
    {
        if ($this->status !== 'in_progress') {
            return null;
        }

        $duration = $this->quiz->duration_minutes * 60;
        $elapsed = now()->diffInSeconds($this->started_at);
        $remaining = $duration - $elapsed;

        return max(0, $remaining);
    }

    public function getIsTimedOutAttribute(): bool
    {
        if ($this->status !== 'in_progress') {
            return false;
        }

        return $this->time_remaining_seconds <= 0;
    }

    public function getCorrectAnswersCountAttribute(): int
    {
        return $this->answers()->where('is_correct', true)->count();
    }

    public function getTotalQuestionsAttribute(): int
    {
        return $this->quiz->questions()->count();
    }

    // Methods

    public function calculateScore(): void
    {
        $totalMarks = $this->quiz->total_marks;
        $obtainedMarks = $this->answers()->sum('marks_obtained');

        $this->score = $obtainedMarks;
        $this->percentage = $totalMarks > 0 ? round(($obtainedMarks / $totalMarks) * 100, 2) : 0;
        $this->is_passed = $this->percentage >= $this->quiz->pass_percentage;
    }

    public function submit(): bool
    {
        $this->calculateScore();
        $this->completed_at = now();
        $this->time_taken_seconds = $this->started_at->diffInSeconds($this->completed_at);
        $this->status = 'completed';

        return $this->save();
    }

    public function timeout(): bool
    {
        $this->calculateScore();
        $this->completed_at = now();
        $this->time_taken_seconds = $this->quiz->duration_minutes * 60;
        $this->status = 'timed_out';

        return $this->save();
    }

    public function abandon(): bool
    {
        $this->status = 'abandoned';
        return $this->save();
    }
}
