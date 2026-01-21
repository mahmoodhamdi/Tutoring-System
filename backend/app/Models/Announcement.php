<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasFactory, SoftDeletes;

    protected $attributes = [
        'priority' => 'normal',
        'type' => 'general',
        'is_pinned' => false,
        'is_published' => false,
    ];

    protected $fillable = [
        'user_id',
        'group_id',
        'title',
        'content',
        'priority',
        'type',
        'is_pinned',
        'is_published',
        'published_at',
        'expires_at',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    // Relationships

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function readBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'announcement_reads')
            ->withPivot('read_at');
    }

    // Scopes

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeActive($query)
    {
        return $query->published()
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>=', now());
            });
    }

    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopeForGroup($query, $groupId)
    {
        return $query->where(function ($q) use ($groupId) {
            $q->whereNull('group_id')
                ->orWhere('group_id', $groupId);
        });
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeUnreadBy($query, $userId)
    {
        return $query->whereDoesntHave('readBy', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }

    // Accessors

    public function getPriorityLabelAttribute(): string
    {
        return match ($this->priority) {
            'low' => 'منخفض',
            'normal' => 'عادي',
            'high' => 'مرتفع',
            'urgent' => 'عاجل',
            default => $this->priority ?? 'عادي',
        };
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'general' => 'عام',
            'schedule' => 'جدول',
            'exam' => 'اختبار',
            'payment' => 'دفع',
            'event' => 'فعالية',
            default => $this->type ?? 'عام',
        };
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function getIsActiveAttribute(): bool
    {
        return $this->is_published && !$this->is_expired;
    }

    public function getReadsCountAttribute(): int
    {
        return $this->readBy()->count();
    }

    // Methods

    public function publish(): bool
    {
        $this->is_published = true;
        $this->published_at = now();
        return $this->save();
    }

    public function unpublish(): bool
    {
        $this->is_published = false;
        return $this->save();
    }

    public function pin(): bool
    {
        $this->is_pinned = true;
        return $this->save();
    }

    public function unpin(): bool
    {
        $this->is_pinned = false;
        return $this->save();
    }

    public function markAsRead(int $userId): void
    {
        if (!$this->readBy()->where('user_id', $userId)->exists()) {
            $this->readBy()->attach($userId, ['read_at' => now()]);
        }
    }

    public function isReadBy(int $userId): bool
    {
        return $this->readBy()->where('user_id', $userId)->exists();
    }
}
