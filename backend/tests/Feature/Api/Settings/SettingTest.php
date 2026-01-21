<?php

namespace Tests\Feature\Api\Settings;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SettingTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacher;
    protected User $student;

    protected function setUp(): void
    {
        parent::setUp();

        $this->teacher = User::factory()->teacher()->create();
        $this->student = User::factory()->student()->create();
    }

    // =====================
    // Public Settings Tests
    // =====================

    public function test_can_get_public_settings_without_auth(): void
    {
        Setting::factory()->public()->create(['key' => 'app_name', 'value' => 'Test App']);
        Setting::factory()->private()->create(['key' => 'smtp_password', 'value' => 'secret']);

        $response = $this->getJson('/api/settings/public');

        $response->assertOk()
            ->assertJsonStructure(['data']);

        $data = $response->json('data');
        $keys = array_column($data, 'key');

        $this->assertContains('app_name', $keys);
        $this->assertNotContains('smtp_password', $keys);
    }

    // =======================
    // Index (All Settings)
    // =======================

    public function test_teacher_can_list_all_settings(): void
    {
        Sanctum::actingAs($this->teacher);

        Setting::factory()->group('general')->count(3)->create();
        Setting::factory()->group('payments')->count(2)->create();

        $response = $this->getJson('/api/settings');

        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'groups',
            ]);

        $groups = $response->json('groups');
        $this->assertContains('general', $groups);
        $this->assertContains('payments', $groups);
    }

    public function test_student_can_list_settings(): void
    {
        Sanctum::actingAs($this->student);

        Setting::factory()->count(3)->create();

        $response = $this->getJson('/api/settings');

        $response->assertOk();
    }

    public function test_unauthenticated_cannot_list_all_settings(): void
    {
        $response = $this->getJson('/api/settings');

        $response->assertUnauthorized();
    }

    // =======================
    // Show Single Setting
    // =======================

    public function test_can_show_setting_by_key(): void
    {
        Sanctum::actingAs($this->teacher);

        Setting::factory()->create([
            'key' => 'app_name',
            'value' => 'My App',
            'type' => 'string',
            'group' => 'general',
        ]);

        $response = $this->getJson('/api/settings/app_name');

        $response->assertOk()
            ->assertJsonPath('data.key', 'app_name')
            ->assertJsonPath('data.value', 'My App')
            ->assertJsonPath('data.group', 'general');
    }

    public function test_returns_404_for_nonexistent_setting(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/settings/nonexistent_key');

        $response->assertNotFound();
    }

    // ====================
    // By Group
    // ====================

    public function test_can_get_settings_by_group(): void
    {
        Sanctum::actingAs($this->teacher);

        Setting::factory()->group('email')->count(3)->create();
        Setting::factory()->group('sms')->count(2)->create();

        $response = $this->getJson('/api/settings/group/email');

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonPath('group', 'email');
    }

    public function test_returns_404_for_empty_group(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/settings/group/nonexistent');

        $response->assertNotFound();
    }

    // ====================
    // Update Single Setting
    // ====================

    public function test_teacher_can_update_string_setting(): void
    {
        Sanctum::actingAs($this->teacher);

        Setting::factory()->create([
            'key' => 'app_name',
            'value' => 'Old Name',
            'type' => 'string',
        ]);

        $response = $this->putJson('/api/settings/app_name', [
            'value' => 'New Name',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.value', 'New Name');

        $this->assertDatabaseHas('settings', [
            'key' => 'app_name',
            'value' => 'New Name',
        ]);
    }

    public function test_teacher_can_update_boolean_setting(): void
    {
        Sanctum::actingAs($this->teacher);

        Setting::factory()->boolean()->create([
            'key' => 'dark_mode',
            'value' => '0',
        ]);

        $response = $this->putJson('/api/settings/dark_mode', [
            'value' => true,
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('settings', [
            'key' => 'dark_mode',
            'value' => '1',
        ]);
    }

    public function test_teacher_can_update_integer_setting(): void
    {
        Sanctum::actingAs($this->teacher);

        Setting::factory()->integer()->create([
            'key' => 'session_duration',
            'value' => '60',
        ]);

        $response = $this->putJson('/api/settings/session_duration', [
            'value' => 90,
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('settings', [
            'key' => 'session_duration',
            'value' => '90',
        ]);
    }

    public function test_teacher_can_update_json_setting(): void
    {
        Sanctum::actingAs($this->teacher);

        Setting::factory()->json()->create([
            'key' => 'payment_methods',
        ]);

        $response = $this->putJson('/api/settings/payment_methods', [
            'value' => ['cash', 'card', 'paypal'],
        ]);

        $response->assertOk();

        $setting = Setting::where('key', 'payment_methods')->first();
        $this->assertEquals(['cash', 'card', 'paypal'], json_decode($setting->value, true));
    }

    public function test_student_cannot_update_setting(): void
    {
        Sanctum::actingAs($this->student);

        Setting::factory()->create(['key' => 'app_name']);

        $response = $this->putJson('/api/settings/app_name', [
            'value' => 'Hacked',
        ]);

        $response->assertForbidden();
    }

    public function test_returns_404_when_updating_nonexistent_setting(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->putJson('/api/settings/nonexistent', [
            'value' => 'test',
        ]);

        $response->assertNotFound();
    }

    // ====================
    // Bulk Update
    // ====================

    public function test_teacher_can_bulk_update_settings(): void
    {
        Sanctum::actingAs($this->teacher);

        Setting::factory()->create(['key' => 'app_name', 'value' => 'Old', 'type' => 'string']);
        Setting::factory()->integer()->create(['key' => 'session_duration', 'value' => '60']);

        $response = $this->putJson('/api/settings', [
            'settings' => [
                ['key' => 'app_name', 'value' => 'New App'],
                ['key' => 'session_duration', 'value' => '90'],
            ],
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('settings', ['key' => 'app_name', 'value' => 'New App']);
        $this->assertDatabaseHas('settings', ['key' => 'session_duration', 'value' => '90']);
    }

    public function test_student_cannot_bulk_update_settings(): void
    {
        Sanctum::actingAs($this->student);

        Setting::factory()->create(['key' => 'app_name']);

        $response = $this->putJson('/api/settings', [
            'settings' => [
                ['key' => 'app_name', 'value' => 'Hacked'],
            ],
        ]);

        $response->assertForbidden();
    }

    public function test_bulk_update_requires_settings_array(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->putJson('/api/settings', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['settings']);
    }

    // ====================
    // Clear Cache
    // ====================

    public function test_teacher_can_clear_settings_cache(): void
    {
        Sanctum::actingAs($this->teacher);

        // Create a setting and cache it
        $setting = Setting::factory()->create(['key' => 'test_key', 'value' => 'cached_value']);
        Setting::get('test_key');

        $response = $this->postJson('/api/settings/clear-cache');

        $response->assertOk();
    }

    // ====================
    // Value Casting Tests
    // ====================

    public function test_boolean_setting_returns_bool_type(): void
    {
        Sanctum::actingAs($this->teacher);

        Setting::factory()->create([
            'key' => 'dark_mode',
            'value' => '1',
            'type' => 'boolean',
        ]);

        $value = Setting::get('dark_mode');

        $this->assertIsBool($value);
        $this->assertTrue($value);
    }

    public function test_integer_setting_returns_int_type(): void
    {
        Setting::factory()->create([
            'key' => 'timeout',
            'value' => '300',
            'type' => 'integer',
        ]);

        $value = Setting::get('timeout');

        $this->assertIsInt($value);
        $this->assertEquals(300, $value);
    }

    public function test_json_setting_returns_array_type(): void
    {
        Setting::factory()->create([
            'key' => 'methods',
            'value' => '["a","b","c"]',
            'type' => 'json',
        ]);

        $value = Setting::get('methods');

        $this->assertIsArray($value);
        $this->assertEquals(['a', 'b', 'c'], $value);
    }

    public function test_get_returns_default_when_setting_not_found(): void
    {
        $value = Setting::get('nonexistent', 'default_value');

        $this->assertEquals('default_value', $value);
    }

    // ====================
    // Model Methods Tests
    // ====================

    public function test_set_method_creates_new_setting(): void
    {
        Setting::set('new_setting', 'new_value');

        $this->assertDatabaseHas('settings', [
            'key' => 'new_setting',
            'value' => 'new_value',
        ]);
    }

    public function test_set_method_updates_existing_setting(): void
    {
        Setting::factory()->create(['key' => 'existing', 'value' => 'old']);

        Setting::set('existing', 'new');

        $this->assertDatabaseHas('settings', [
            'key' => 'existing',
            'value' => 'new',
        ]);
    }

    public function test_get_all_grouped_returns_grouped_settings(): void
    {
        Setting::factory()->group('general')->count(2)->create();
        Setting::factory()->group('email')->count(3)->create();

        $grouped = Setting::getAllGrouped();

        $this->assertArrayHasKey('general', $grouped);
        $this->assertArrayHasKey('email', $grouped);
        $this->assertCount(2, $grouped['general']);
        $this->assertCount(3, $grouped['email']);
    }

    public function test_get_public_returns_only_public_settings(): void
    {
        Setting::factory()->public()->count(2)->create();
        Setting::factory()->private()->count(3)->create();

        $public = Setting::getPublic();

        $this->assertCount(2, $public);
    }

    // ====================
    // Validation Tests
    // ====================

    public function test_boolean_setting_validates_boolean_value(): void
    {
        Sanctum::actingAs($this->teacher);

        Setting::factory()->boolean()->create(['key' => 'test_bool']);

        $response = $this->putJson('/api/settings/test_bool', [
            'value' => 'not_a_boolean',
        ]);

        $response->assertUnprocessable();
    }

    public function test_integer_setting_validates_integer_value(): void
    {
        Sanctum::actingAs($this->teacher);

        Setting::factory()->integer()->create(['key' => 'test_int']);

        $response = $this->putJson('/api/settings/test_int', [
            'value' => 'not_an_integer',
        ]);

        $response->assertUnprocessable();
    }

    public function test_json_setting_validates_array_value(): void
    {
        Sanctum::actingAs($this->teacher);

        Setting::factory()->json()->create(['key' => 'test_json']);

        $response = $this->putJson('/api/settings/test_json', [
            'value' => 'not_an_array',
        ]);

        $response->assertUnprocessable();
    }
}
