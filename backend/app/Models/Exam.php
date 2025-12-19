<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'group_id',
        'title',
        'description',
        'exam_date',
        'start_time',
        'duration_minutes',
        'total_marks',
        'pass_marks',
        'exam_type',
        'status',
        'instructions',
        'is_published',
    ];

    protected $casts = [
        'exam_date' => 'date',
        'start_time' => 'datetime:H:i',
        'total_marks' => 'decimal:2',
        'pass_marks' => 'decimal:2',
        'is_published' => 'boolean',
        'duration_minutes' => 'integer',
    ];

    // Relationships

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(ExamResult::class);
    }

    // Scopes

    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('exam_date', '>=', now()->toDateString())
            ->where('status', 'scheduled');
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('exam_date', '>=', now()->subDays($days)->toDateString())
            ->where('exam_date', '<=', now()->toDateString());
    }

    public function scopeByGroup($query, $groupId)
    {
        return $query->where('group_id', $groupId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('exam_type', $type);
    }

    // Accessors

    public function getIsPastAttribute(): bool
    {
        return $this->exam_date->isPast();
    }

    public function getIsUpcomingAttribute(): bool
    {
        return $this->exam_date->isFuture() || $this->exam_date->isToday();
    }

    public function getResultsCountAttribute(): int
    {
        return $this->results()->count();
    }

    public function getGradedCountAttribute(): int
    {
        return $this->results()->where('status', 'graded')->count();
    }

    public function getAverageMarksAttribute(): ?float
    {
        $avg = $this->results()->where('status', 'graded')->avg('marks_obtained');
        return $avg ? round($avg, 2) : null;
    }

    public function getAveragePercentageAttribute(): ?float
    {
        $avg = $this->results()->where('status', 'graded')->avg('percentage');
        return $avg ? round($avg, 2) : null;
    }

    public function getPassRateAttribute(): ?float
    {
        $graded = $this->results()->where('status', 'graded')->count();
        if ($graded === 0) {
            return null;
        }

        $passMarks = $this->pass_marks ?? ($this->total_marks * 0.6);
        $passed = $this->results()
            ->where('status', 'graded')
            ->where('marks_obtained', '>=', $passMarks)
            ->count();

        return round(($passed / $graded) * 100, 2);
    }

    public function getExamTypeLabelAttribute(): string
    {
        return match ($this->exam_type) {
            'quiz' => 'اختبار قصير',
            'midterm' => 'اختبار نصفي',
            'final' => 'اختبار نهائي',
            'assignment' => 'واجب',
            default => $this->exam_type,
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'scheduled' => 'مجدول',
            'in_progress' => 'قيد التنفيذ',
            'completed' => 'مكتمل',
            'cancelled' => 'ملغي',
            default => $this->status,
        };
    }

    // Methods

    public function publish(): bool
    {
        $this->is_published = true;
        return $this->save();
    }

    public function cancel(): bool
    {
        $this->status = 'cancelled';
        return $this->save();
    }

    public function complete(): bool
    {
        $this->status = 'completed';
        return $this->save();
    }

    public function canBeEdited(): bool
    {
        return in_array($this->status, ['scheduled']) && !$this->is_past;
    }
}
