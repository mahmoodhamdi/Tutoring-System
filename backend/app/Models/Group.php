<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Group extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'subject',
        'grade_level',
        'max_students',
        'monthly_fee',
        'schedule_description',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'max_students' => 'integer',
        'monthly_fee' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the students in this group.
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_student', 'group_id', 'student_id')
            ->withPivot(['joined_at', 'left_at', 'is_active', 'notes'])
            ->withTimestamps();
    }

    /**
     * Get only active students in this group.
     */
    public function activeStudents(): BelongsToMany
    {
        return $this->students()->wherePivot('is_active', true);
    }

    /**
     * Get the sessions for this group.
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class);
    }

    /**
     * Get the current student count.
     */
    public function getStudentCountAttribute(): int
    {
        return $this->activeStudents()->count();
    }

    /**
     * Check if group is full.
     */
    public function isFull(): bool
    {
        return $this->student_count >= $this->max_students;
    }

    /**
     * Check if group has available spots.
     */
    public function hasAvailableSpots(): bool
    {
        return !$this->isFull();
    }

    /**
     * Get available spots count.
     */
    public function getAvailableSpotsAttribute(): int
    {
        return max(0, $this->max_students - $this->student_count);
    }

    /**
     * Scope to filter only active groups.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by subject.
     */
    public function scopeSubject($query, string $subject)
    {
        return $query->where('subject', $subject);
    }

    /**
     * Scope to filter by grade level.
     */
    public function scopeGradeLevel($query, string $gradeLevel)
    {
        return $query->where('grade_level', $gradeLevel);
    }

    /**
     * Scope to filter groups with available spots.
     */
    public function scopeWithAvailableSpots($query)
    {
        return $query->whereRaw('(SELECT COUNT(*) FROM group_student WHERE group_student.group_id = groups.id AND group_student.is_active = 1) < groups.max_students');
    }
}
