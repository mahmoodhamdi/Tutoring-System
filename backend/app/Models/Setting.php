<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    /**
     * Cache key prefix for settings.
     */
    private const CACHE_PREFIX = 'settings:';
    private const CACHE_ALL_KEY = 'settings:all';
    private const CACHE_TTL = 86400; // 24 hours

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'label',
        'description',
        'is_public',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_public' => 'boolean',
    ];

    /**
     * Get a setting value by key.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = Cache::remember(
            self::CACHE_PREFIX . $key,
            self::CACHE_TTL,
            fn () => static::where('key', $key)->first()
        );

        if (!$setting) {
            return $default;
        }

        return self::castValue($setting->value, $setting->type);
    }

    /**
     * Set a setting value.
     */
    public static function set(string $key, mixed $value, ?string $type = null): static
    {
        $setting = static::updateOrCreate(
            ['key' => $key],
            [
                'value' => is_array($value) || is_object($value) ? json_encode($value) : $value,
                'type' => $type ?? self::detectType($value),
            ]
        );

        // Clear cache
        self::clearCache($key);

        return $setting;
    }

    /**
     * Get all settings grouped.
     */
    public static function getAllGrouped(): array
    {
        return Cache::remember(
            self::CACHE_ALL_KEY,
            self::CACHE_TTL,
            function () {
                $settings = static::all();
                $grouped = [];

                foreach ($settings as $setting) {
                    $grouped[$setting->group][$setting->key] = [
                        'id' => $setting->id,
                        'key' => $setting->key,
                        'value' => self::castValue($setting->value, $setting->type),
                        'type' => $setting->type,
                        'label' => $setting->label,
                        'description' => $setting->description,
                        'is_public' => $setting->is_public,
                    ];
                }

                return $grouped;
            }
        );
    }

    /**
     * Get settings by group.
     */
    public static function getByGroup(string $group): array
    {
        return Cache::remember(
            self::CACHE_PREFIX . 'group:' . $group,
            self::CACHE_TTL,
            function () use ($group) {
                return static::where('group', $group)
                    ->get()
                    ->mapWithKeys(function ($setting) {
                        return [
                            $setting->key => self::castValue($setting->value, $setting->type)
                        ];
                    })
                    ->toArray();
            }
        );
    }

    /**
     * Get public settings only.
     */
    public static function getPublic(): array
    {
        return Cache::remember(
            self::CACHE_PREFIX . 'public',
            self::CACHE_TTL,
            function () {
                return static::where('is_public', true)
                    ->get()
                    ->map(function ($setting) {
                        return [
                            'id' => $setting->id,
                            'key' => $setting->key,
                            'value' => self::castValue($setting->value, $setting->type),
                            'type' => $setting->type,
                            'label' => $setting->label,
                            'description' => $setting->description,
                        ];
                    })
                    ->values()
                    ->toArray();
            }
        );
    }

    /**
     * Bulk update settings.
     */
    public static function bulkUpdate(array $settings): void
    {
        foreach ($settings as $key => $value) {
            $setting = static::where('key', $key)->first();

            if ($setting) {
                $setting->update([
                    'value' => is_array($value) || is_object($value) ? json_encode($value) : $value,
                ]);
            }
        }

        // Clear all cache
        self::clearAllCache();
    }

    /**
     * Cast value based on type.
     */
    private static function castValue(mixed $value, string $type): mixed
    {
        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'json' => json_decode($value, true),
            'array' => json_decode($value, true),
            default => $value,
        };
    }

    /**
     * Detect value type.
     */
    private static function detectType(mixed $value): string
    {
        if (is_bool($value)) {
            return 'boolean';
        }

        if (is_int($value)) {
            return 'integer';
        }

        if (is_array($value) || is_object($value)) {
            return 'json';
        }

        return 'string';
    }

    /**
     * Clear cache for a specific key.
     */
    public static function clearCache(?string $key = null): void
    {
        if ($key) {
            Cache::forget(self::CACHE_PREFIX . $key);
        }

        // Always clear the all cache when any setting changes
        Cache::forget(self::CACHE_ALL_KEY);
        Cache::forget(self::CACHE_PREFIX . 'public');
    }

    /**
     * Clear all settings cache.
     */
    public static function clearAllCache(): void
    {
        $settings = static::all();

        foreach ($settings as $setting) {
            Cache::forget(self::CACHE_PREFIX . $setting->key);
            Cache::forget(self::CACHE_PREFIX . 'group:' . $setting->group);
        }

        Cache::forget(self::CACHE_ALL_KEY);
        Cache::forget(self::CACHE_PREFIX . 'public');
    }

    /**
     * Scope for filtering by group.
     */
    public function scopeGroup($query, string $group)
    {
        return $query->where('group', $group);
    }

    /**
     * Scope for public settings.
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Boot method to clear cache on model events.
     */
    protected static function booted(): void
    {
        static::saved(function (Setting $setting) {
            self::clearCache($setting->key);
        });

        static::deleted(function (Setting $setting) {
            self::clearCache($setting->key);
        });
    }
}
