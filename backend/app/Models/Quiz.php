<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'title',
        'description',
        'instructions',
        'duration_minutes',
        'total_marks',
        'pass_percentage',
        'max_attempts',
        'shuffle_questions',
        'shuffle_answers',
        'show_correct_answers',
        'show_score_immediately',
        'available_from',
        'available_until',
        'is_published',
    ];

    protected $casts = [
        'total_marks' => 'decimal:2',
        'pass_percentage' => 'decimal:2',
        'duration_minutes' => 'integer',
        'max_attempts' => 'integer',
        'shuffle_questions' => 'boolean',
        'shuffle_answers' => 'boolean',
        'show_correct_answers' => 'boolean',
        'show_score_immediately' => 'boolean',
        'available_from' => 'datetime',
        'available_until' => 'datetime',
        'is_published' => 'boolean',
    ];

    // Relationships

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(QuizQuestion::class)->orderBy('order_index');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(QuizAttempt::class);
    }

    // Scopes

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeAvailable($query)
    {
        return $query->published()
            ->where(function ($q) {
                $q->whereNull('available_from')
                    ->orWhere('available_from', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('available_until')
                    ->orWhere('available_until', '>=', now());
            });
    }

    public function scopeByGroup($query, $groupId)
    {
        return $query->where('group_id', $groupId);
    }

    // Accessors

    public function getQuestionsCountAttribute(): int
    {
        return $this->questions()->count();
    }

    public function getAttemptsCountAttribute(): int
    {
        return $this->attempts()->count();
    }

    public function getCompletedAttemptsCountAttribute(): int
    {
        return $this->attempts()->where('status', 'completed')->count();
    }

    public function getAverageScoreAttribute(): ?float
    {
        $avg = $this->attempts()->where('status', 'completed')->avg('score');
        return $avg ? round($avg, 2) : null;
    }

    public function getAveragePercentageAttribute(): ?float
    {
        $avg = $this->attempts()->where('status', 'completed')->avg('percentage');
        return $avg ? round($avg, 2) : null;
    }

    public function getIsAvailableAttribute(): bool
    {
        if (!$this->is_published) {
            return false;
        }

        if ($this->available_from && $this->available_from->isFuture()) {
            return false;
        }

        if ($this->available_until && $this->available_until->isPast()) {
            return false;
        }

        return true;
    }

    // Methods

    public function publish(): bool
    {
        $this->recalculateTotalMarks();
        $this->is_published = true;
        return $this->save();
    }

    public function unpublish(): bool
    {
        $this->is_published = false;
        return $this->save();
    }

    public function recalculateTotalMarks(): void
    {
        $this->total_marks = $this->questions()->sum('marks');
        $this->save();
    }

    public function canStudentAttempt(int $studentId): bool
    {
        if (!$this->is_available) {
            return false;
        }

        $attemptCount = $this->attempts()
            ->where('student_id', $studentId)
            ->whereIn('status', ['completed', 'timed_out'])
            ->count();

        return $attemptCount < $this->max_attempts;
    }

    public function getStudentAttemptsCount(int $studentId): int
    {
        return $this->attempts()
            ->where('student_id', $studentId)
            ->whereIn('status', ['completed', 'timed_out'])
            ->count();
    }

    public function duplicate(): Quiz
    {
        $newQuiz = $this->replicate();
        $newQuiz->title = $this->title . ' (نسخة)';
        $newQuiz->is_published = false;
        $newQuiz->save();

        foreach ($this->questions as $question) {
            $newQuestion = $question->replicate();
            $newQuestion->quiz_id = $newQuiz->id;
            $newQuestion->save();

            foreach ($question->options as $option) {
                $newOption = $option->replicate();
                $newOption->question_id = $newQuestion->id;
                $newOption->save();
            }
        }

        return $newQuiz;
    }
}
