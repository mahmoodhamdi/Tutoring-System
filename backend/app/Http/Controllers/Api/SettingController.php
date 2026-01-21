<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateSettingRequest;
use App\Http\Requests\Settings\UpdateSettingsRequest;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Get all settings grouped by group.
     */
    public function index(Request $request): JsonResponse
    {
        $grouped = Setting::getAllGrouped();

        return response()->json([
            'data' => $grouped,
            'groups' => array_keys($grouped),
        ]);
    }

    /**
     * Get public settings (no auth required).
     */
    public function publicSettings(): JsonResponse
    {
        return response()->json([
            'data' => Setting::getPublic(),
        ]);
    }

    /**
     * Get a single setting by key.
     */
    public function show(string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'message' => 'الإعداد غير موجود',
            ], 404);
        }

        return response()->json([
            'data' => [
                'id' => $setting->id,
                'key' => $setting->key,
                'value' => Setting::get($key),
                'type' => $setting->type,
                'group' => $setting->group,
                'label' => $setting->label,
                'description' => $setting->description,
                'is_public' => $setting->is_public,
            ],
        ]);
    }

    /**
     * Bulk update settings.
     */
    public function update(UpdateSettingsRequest $request): JsonResponse
    {
        $settings = collect($request->settings)->mapWithKeys(function ($item) {
            return [$item['key'] => $item['value']];
        })->toArray();

        Setting::bulkUpdate($settings);

        return response()->json([
            'message' => 'تم تحديث الإعدادات بنجاح',
            'data' => Setting::getAllGrouped(),
        ]);
    }

    /**
     * Update a single setting.
     */
    public function updateSingle(UpdateSettingRequest $request, string $key): JsonResponse
    {
        $setting = Setting::where('key', $key)->first();

        if (!$setting) {
            return response()->json([
                'message' => 'الإعداد غير موجود',
            ], 404);
        }

        $value = $request->value;

        // Handle array/json values
        if (is_array($value)) {
            $value = json_encode($value);
        }

        $setting->update(['value' => $value]);

        return response()->json([
            'message' => 'تم تحديث الإعداد بنجاح',
            'data' => [
                'id' => $setting->id,
                'key' => $setting->key,
                'value' => Setting::get($key),
                'type' => $setting->type,
                'group' => $setting->group,
            ],
        ]);
    }

    /**
     * Get settings by group.
     */
    public function byGroup(string $group): JsonResponse
    {
        $settings = Setting::where('group', $group)->get();

        if ($settings->isEmpty()) {
            return response()->json([
                'message' => 'لا توجد إعدادات لهذه المجموعة',
            ], 404);
        }

        return response()->json([
            'data' => $settings->map(function ($setting) {
                return [
                    'id' => $setting->id,
                    'key' => $setting->key,
                    'value' => Setting::get($setting->key),
                    'type' => $setting->type,
                    'label' => $setting->label,
                    'description' => $setting->description,
                    'is_public' => $setting->is_public,
                ];
            }),
            'group' => $group,
        ]);
    }

    /**
     * Clear settings cache.
     */
    public function clearCache(): JsonResponse
    {
        Setting::clearAllCache();

        return response()->json([
            'message' => 'تم مسح ذاكرة التخزين المؤقت للإعدادات',
        ]);
    }
}
