<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'student_id',
        'marks_obtained',
        'obtained_marks',
        'is_passed',
        'notes',
        'percentage',
        'grade',
        'status',
        'feedback',
        'graded_by',
        'graded_at',
    ];

    protected $casts = [
        'marks_obtained' => 'decimal:2',
        'obtained_marks' => 'decimal:2',
        'percentage' => 'decimal:2',
        'is_passed' => 'boolean',
        'graded_at' => 'datetime',
    ];

    // Relationships

    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function gradedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'graded_by');
    }

    // Scopes

    public function scopeGraded($query)
    {
        return $query->where('status', 'graded');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSubmitted($query)
    {
        return $query->where('status', 'submitted');
    }

    public function scopeAbsent($query)
    {
        return $query->where('status', 'absent');
    }

    public function scopePassed($query)
    {
        return $query->where('status', 'graded')
            ->where('is_passed', true);
    }

    // Accessors

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'معلق',
            'submitted' => 'تم التسليم',
            'graded' => 'تم التصحيح',
            'absent' => 'غائب',
            default => $this->status,
        };
    }

    public function getGradeLabelAttribute(): ?string
    {
        return $this->grade;
    }

    // Methods

    public function calculateGrade(): string
    {
        if ($this->percentage === null) {
            return '';
        }

        $percentage = $this->percentage;

        return match (true) {
            $percentage >= 95 => 'A+',
            $percentage >= 90 => 'A',
            $percentage >= 85 => 'B+',
            $percentage >= 80 => 'B',
            $percentage >= 75 => 'C+',
            $percentage >= 70 => 'C',
            $percentage >= 60 => 'D',
            default => 'F',
        };
    }

    public function setMarks(float $marks, ?int $gradedBy = null): bool
    {
        $passMarks = $this->exam->pass_marks ?? ($this->exam->total_marks * 0.6);

        $this->marks_obtained = $marks;
        $this->obtained_marks = $marks;
        $this->percentage = round(($marks / $this->exam->total_marks) * 100, 2);
        $this->grade = $this->calculateGrade();
        $this->is_passed = $marks >= $passMarks;
        $this->status = 'graded';
        $this->graded_by = $gradedBy;
        $this->graded_at = now();

        return $this->save();
    }

    public function markAsAbsent(): bool
    {
        $this->status = 'absent';
        $this->marks_obtained = 0;
        $this->obtained_marks = 0;
        $this->percentage = 0;
        $this->grade = 'F';
        $this->is_passed = false;

        return $this->save();
    }
}
