<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuizQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'quiz_id',
        'question_text',
        'question_type',
        'marks',
        'order_index',
        'explanation',
    ];

    protected $casts = [
        'marks' => 'decimal:2',
        'order_index' => 'integer',
    ];

    // Relationships

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(QuizOption::class, 'question_id')->orderBy('order_index');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(QuizAnswer::class, 'question_id');
    }

    // Scopes

    public function scopeOrdered($query)
    {
        return $query->orderBy('order_index');
    }

    // Accessors

    public function getQuestionTypeLabelAttribute(): string
    {
        return match ($this->question_type) {
            'multiple_choice' => 'اختيار من متعدد',
            'true_false' => 'صح أو خطأ',
            'short_answer' => 'إجابة قصيرة',
            'essay' => 'مقالي',
            default => $this->question_type,
        };
    }

    public function getCorrectOptionAttribute(): ?QuizOption
    {
        return $this->options()->where('is_correct', true)->first();
    }

    public function getCorrectOptionsAttribute()
    {
        return $this->options()->where('is_correct', true)->get();
    }

    // Methods

    public function checkAnswer($selectedOptionId = null, $answerText = null): array
    {
        $isCorrect = false;
        $marksObtained = 0;

        switch ($this->question_type) {
            case 'multiple_choice':
            case 'true_false':
                if ($selectedOptionId) {
                    $option = $this->options()->find($selectedOptionId);
                    if ($option && $option->is_correct) {
                        $isCorrect = true;
                        $marksObtained = $this->marks;
                    }
                }
                break;

            case 'short_answer':
                // For short answer, check if the answer matches any correct option
                if ($answerText) {
                    $correctOptions = $this->options()->where('is_correct', true)->pluck('option_text');
                    foreach ($correctOptions as $correctAnswer) {
                        if (mb_strtolower(trim($answerText)) === mb_strtolower(trim($correctAnswer))) {
                            $isCorrect = true;
                            $marksObtained = $this->marks;
                            break;
                        }
                    }
                }
                break;

            case 'essay':
                // Essay questions need manual grading
                $isCorrect = null;
                $marksObtained = 0;
                break;
        }

        return [
            'is_correct' => $isCorrect,
            'marks_obtained' => $marksObtained,
        ];
    }

    protected static function booted()
    {
        static::saved(function ($question) {
            $question->quiz->recalculateTotalMarks();
        });

        static::deleted(function ($question) {
            $question->quiz->recalculateTotalMarks();
        });
    }
}
