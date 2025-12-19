<?php

namespace Tests\Feature\Api\Group;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GroupUpdateTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;
    private Group $group;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->group = Group::factory()->create([
            'name' => 'مجموعة الرياضيات',
            'subject' => 'الرياضيات',
            'max_students' => 20,
            'monthly_fee' => 300.00,
            'is_active' => true,
        ]);
    }

    public function test_guest_cannot_update_group(): void
    {
        $response = $this->putJson("/api/groups/{$this->group->id}", [
            'name' => 'مجموعة معدلة',
        ]);

        $response->assertStatus(401);
    }

    public function test_student_cannot_update_group(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        Sanctum::actingAs($student);

        $response = $this->putJson("/api/groups/{$this->group->id}", [
            'name' => 'مجموعة معدلة',
        ]);

        $response->assertStatus(403);
    }

    public function test_teacher_can_update_group_name(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/groups/{$this->group->id}", [
            'name' => 'مجموعة الرياضيات المتقدمة',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'مجموعة الرياضيات المتقدمة');

        $this->assertDatabaseHas('groups', [
            'id' => $this->group->id,
            'name' => 'مجموعة الرياضيات المتقدمة',
        ]);
    }

    public function test_teacher_can_update_multiple_fields(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/groups/{$this->group->id}", [
            'name' => 'الفيزياء للصف الثاني',
            'subject' => 'الفيزياء',
            'grade_level' => 'الصف الثاني الثانوي',
            'max_students' => 30,
            'monthly_fee' => 400.00,
            'schedule_description' => 'كل سبت من 2 إلى 4 مساءً',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'الفيزياء للصف الثاني')
            ->assertJsonPath('data.subject', 'الفيزياء')
            ->assertJsonPath('data.grade_level', 'الصف الثاني الثانوي')
            ->assertJsonPath('data.max_students', 30)
            ->assertJsonPath('data.monthly_fee', 400.00)
            ->assertJsonPath('data.schedule_description', 'كل سبت من 2 إلى 4 مساءً');
    }

    public function test_teacher_can_deactivate_group(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/groups/{$this->group->id}", [
            'is_active' => false,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.is_active', false);

        $this->assertDatabaseHas('groups', [
            'id' => $this->group->id,
            'is_active' => false,
        ]);
    }

    public function test_teacher_can_activate_group(): void
    {
        $this->group->update(['is_active' => false]);

        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/groups/{$this->group->id}", [
            'is_active' => true,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.is_active', true);
    }

    public function test_cannot_reduce_max_students_below_current_count(): void
    {
        $students = User::factory()->count(15)->create(['role' => 'student']);

        foreach ($students as $student) {
            $this->group->students()->attach($student->id, [
                'joined_at' => now(),
                'is_active' => true,
            ]);
        }

        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/groups/{$this->group->id}", [
            'max_students' => 10,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['max_students']);
    }

    public function test_can_set_max_students_equal_to_current_count(): void
    {
        $students = User::factory()->count(10)->create(['role' => 'student']);

        foreach ($students as $student) {
            $this->group->students()->attach($student->id, [
                'joined_at' => now(),
                'is_active' => true,
            ]);
        }

        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/groups/{$this->group->id}", [
            'max_students' => 10,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.max_students', 10)
            ->assertJsonPath('data.available_spots', 0);
    }

    public function test_name_max_length_validation(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/groups/{$this->group->id}", [
            'name' => str_repeat('أ', 256),
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_monthly_fee_must_be_non_negative(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/groups/{$this->group->id}", [
            'monthly_fee' => -50,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['monthly_fee']);
    }

    public function test_returns_404_for_nonexistent_group(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->putJson('/api/groups/99999', [
            'name' => 'مجموعة معدلة',
        ]);

        $response->assertStatus(404);
    }

    public function test_returns_404_for_deleted_group(): void
    {
        $this->group->delete();

        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/groups/{$this->group->id}", [
            'name' => 'مجموعة معدلة',
        ]);

        $response->assertStatus(404);
    }

    public function test_unchanged_fields_remain_the_same(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/groups/{$this->group->id}", [
            'description' => 'وصف جديد',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'مجموعة الرياضيات')
            ->assertJsonPath('data.subject', 'الرياضيات')
            ->assertJsonPath('data.max_students', 20)
            ->assertJsonPath('data.monthly_fee', 300.00)
            ->assertJsonPath('data.description', 'وصف جديد');
    }
}
