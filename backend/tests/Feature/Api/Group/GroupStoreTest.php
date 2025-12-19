<?php

namespace Tests\Feature\Api\Group;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GroupStoreTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->create(['role' => 'teacher']);
    }

    public function test_guest_cannot_create_group(): void
    {
        $response = $this->postJson('/api/groups', [
            'name' => 'مجموعة جديدة',
        ]);

        $response->assertStatus(401);
    }

    public function test_student_cannot_create_group(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        Sanctum::actingAs($student);

        $response = $this->postJson('/api/groups', [
            'name' => 'مجموعة جديدة',
        ]);

        $response->assertStatus(403);
    }

    public function test_teacher_can_create_group_with_minimal_data(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/groups', [
            'name' => 'مجموعة الرياضيات',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'مجموعة الرياضيات')
            ->assertJsonPath('data.is_active', true);

        $this->assertDatabaseHas('groups', [
            'name' => 'مجموعة الرياضيات',
            'is_active' => true,
        ]);
    }

    public function test_teacher_can_create_group_with_full_data(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/groups', [
            'name' => 'الرياضيات للصف الأول',
            'description' => 'مجموعة لتعليم الرياضيات للصف الأول الثانوي',
            'subject' => 'الرياضيات',
            'grade_level' => 'الصف الأول الثانوي',
            'max_students' => 25,
            'monthly_fee' => 350.00,
            'schedule_description' => 'كل أحد وأربعاء من 4 إلى 6 مساءً',
            'is_active' => true,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'الرياضيات للصف الأول')
            ->assertJsonPath('data.description', 'مجموعة لتعليم الرياضيات للصف الأول الثانوي')
            ->assertJsonPath('data.subject', 'الرياضيات')
            ->assertJsonPath('data.grade_level', 'الصف الأول الثانوي')
            ->assertJsonPath('data.max_students', 25)
            ->assertJsonPath('data.monthly_fee', 350.00)
            ->assertJsonPath('data.schedule_description', 'كل أحد وأربعاء من 4 إلى 6 مساءً')
            ->assertJsonPath('data.is_active', true);

        $this->assertDatabaseHas('groups', [
            'name' => 'الرياضيات للصف الأول',
            'subject' => 'الرياضيات',
            'monthly_fee' => 350.00,
        ]);
    }

    public function test_name_is_required(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/groups', [
            'description' => 'وصف المجموعة',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_name_max_length_is_validated(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/groups', [
            'name' => str_repeat('أ', 256),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_max_students_must_be_positive(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/groups', [
            'name' => 'مجموعة جديدة',
            'max_students' => 0,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['max_students']);
    }

    public function test_max_students_cannot_exceed_100(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/groups', [
            'name' => 'مجموعة جديدة',
            'max_students' => 101,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['max_students']);
    }

    public function test_monthly_fee_must_be_non_negative(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/groups', [
            'name' => 'مجموعة جديدة',
            'monthly_fee' => -100,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['monthly_fee']);
    }

    public function test_monthly_fee_can_be_zero(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/groups', [
            'name' => 'مجموعة مجانية',
            'monthly_fee' => 0,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.monthly_fee', 0.0);
    }

    public function test_is_active_defaults_to_true(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/groups', [
            'name' => 'مجموعة جديدة',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.is_active', true);
    }

    public function test_can_create_inactive_group(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/groups', [
            'name' => 'مجموعة غير نشطة',
            'is_active' => false,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.is_active', false);
    }

    public function test_response_includes_student_count_and_available_spots(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/groups', [
            'name' => 'مجموعة جديدة',
            'max_students' => 20,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.student_count', 0)
            ->assertJsonPath('data.available_spots', 20);
    }
}
