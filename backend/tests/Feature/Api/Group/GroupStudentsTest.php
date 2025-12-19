<?php

namespace Tests\Feature\Api\Group;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GroupStudentsTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;
    private Group $group;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->group = Group::factory()->create(['max_students' => 20]);
    }

    // Add Students Tests

    public function test_guest_cannot_add_students_to_group(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        $response = $this->postJson("/api/groups/{$this->group->id}/students", [
            'student_ids' => [$student->id],
        ]);

        $response->assertStatus(401);
    }

    public function test_student_cannot_add_students_to_group(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $anotherStudent = User::factory()->create(['role' => 'student']);

        Sanctum::actingAs($student);

        $response = $this->postJson("/api/groups/{$this->group->id}/students", [
            'student_ids' => [$anotherStudent->id],
        ]);

        $response->assertStatus(403);
    }

    public function test_teacher_can_add_single_student_to_group(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        Sanctum::actingAs($this->teacher);

        $response = $this->postJson("/api/groups/{$this->group->id}/students", [
            'student_ids' => [$student->id],
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'تمت إضافة الطلاب بنجاح',
                'added_count' => 1,
            ]);

        $this->assertDatabaseHas('group_student', [
            'group_id' => $this->group->id,
            'student_id' => $student->id,
            'is_active' => true,
        ]);
    }

    public function test_teacher_can_add_multiple_students_to_group(): void
    {
        $students = User::factory()->count(3)->create(['role' => 'student']);
        $studentIds = $students->pluck('id')->toArray();

        Sanctum::actingAs($this->teacher);

        $response = $this->postJson("/api/groups/{$this->group->id}/students", [
            'student_ids' => $studentIds,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'added_count' => 3,
            ]);

        foreach ($studentIds as $studentId) {
            $this->assertDatabaseHas('group_student', [
                'group_id' => $this->group->id,
                'student_id' => $studentId,
                'is_active' => true,
            ]);
        }
    }

    public function test_can_specify_joined_at_date(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        Sanctum::actingAs($this->teacher);

        $response = $this->postJson("/api/groups/{$this->group->id}/students", [
            'student_ids' => [$student->id],
            'joined_at' => '2024-01-15',
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('group_student', [
            'group_id' => $this->group->id,
            'student_id' => $student->id,
            'joined_at' => '2024-01-15',
        ]);
    }

    public function test_cannot_exceed_max_students(): void
    {
        $this->group->update(['max_students' => 5]);

        $existingStudents = User::factory()->count(4)->create(['role' => 'student']);
        foreach ($existingStudents as $student) {
            $this->group->students()->attach($student->id, [
                'joined_at' => now(),
                'is_active' => true,
            ]);
        }

        $newStudents = User::factory()->count(3)->create(['role' => 'student']);
        $newStudentIds = $newStudents->pluck('id')->toArray();

        Sanctum::actingAs($this->teacher);

        $response = $this->postJson("/api/groups/{$this->group->id}/students", [
            'student_ids' => $newStudentIds,
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'عدد الطلاب سيتجاوز الحد الأقصى للمجموعة');
    }

    public function test_cannot_add_student_already_in_group(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $this->group->students()->attach($student->id, [
            'joined_at' => now(),
            'is_active' => true,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->postJson("/api/groups/{$this->group->id}/students", [
            'student_ids' => [$student->id],
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'بعض الطلاب موجودون بالفعل في المجموعة');
    }

    public function test_student_ids_must_be_array(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson("/api/groups/{$this->group->id}/students", [
            'student_ids' => 'not-an-array',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['student_ids']);
    }

    public function test_student_ids_must_exist(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson("/api/groups/{$this->group->id}/students", [
            'student_ids' => [99999],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['student_ids.0']);
    }

    // Remove Student Tests

    public function test_guest_cannot_remove_student_from_group(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $this->group->students()->attach($student->id, [
            'joined_at' => now(),
            'is_active' => true,
        ]);

        $response = $this->deleteJson("/api/groups/{$this->group->id}/students/{$student->id}");

        $response->assertStatus(401);
    }

    public function test_student_cannot_remove_student_from_group(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $anotherStudent = User::factory()->create(['role' => 'student']);
        $this->group->students()->attach($anotherStudent->id, [
            'joined_at' => now(),
            'is_active' => true,
        ]);

        Sanctum::actingAs($student);

        $response = $this->deleteJson("/api/groups/{$this->group->id}/students/{$anotherStudent->id}");

        $response->assertStatus(403);
    }

    public function test_teacher_can_remove_student_from_group(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $this->group->students()->attach($student->id, [
            'joined_at' => now(),
            'is_active' => true,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->deleteJson("/api/groups/{$this->group->id}/students/{$student->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'تم إزالة الطالب من المجموعة بنجاح',
            ]);

        $this->assertDatabaseHas('group_student', [
            'group_id' => $this->group->id,
            'student_id' => $student->id,
            'is_active' => false,
        ]);

        // Verify left_at is set
        $pivot = $this->group->students()->where('student_id', $student->id)->first()->pivot;
        $this->assertNotNull($pivot->left_at);
    }

    public function test_cannot_remove_student_not_in_group(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        Sanctum::actingAs($this->teacher);

        $response = $this->deleteJson("/api/groups/{$this->group->id}/students/{$student->id}");

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'الطالب غير موجود في المجموعة',
            ]);
    }

    public function test_cannot_remove_already_inactive_student(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $this->group->students()->attach($student->id, [
            'joined_at' => now()->subMonth(),
            'left_at' => now(),
            'is_active' => false,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->deleteJson("/api/groups/{$this->group->id}/students/{$student->id}");

        $response->assertStatus(404)
            ->assertJson([
                'message' => 'الطالب غير موجود في المجموعة',
            ]);
    }

    // List Students Tests

    public function test_guest_cannot_list_group_students(): void
    {
        $response = $this->getJson("/api/groups/{$this->group->id}/students");

        $response->assertStatus(401);
    }

    public function test_teacher_can_list_group_students(): void
    {
        $students = User::factory()->count(3)->create(['role' => 'student']);
        foreach ($students as $student) {
            $this->group->students()->attach($student->id, [
                'joined_at' => now(),
                'is_active' => true,
            ]);
        }

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/groups/{$this->group->id}/students");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'phone',
                        'pivot' => [
                            'joined_at',
                            'is_active',
                        ],
                    ],
                ],
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_only_lists_active_students_by_default(): void
    {
        $activeStudent = User::factory()->create(['role' => 'student']);
        $inactiveStudent = User::factory()->create(['role' => 'student']);

        $this->group->students()->attach($activeStudent->id, [
            'joined_at' => now(),
            'is_active' => true,
        ]);

        $this->group->students()->attach($inactiveStudent->id, [
            'joined_at' => now()->subMonth(),
            'left_at' => now(),
            'is_active' => false,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/groups/{$this->group->id}/students");

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $activeStudent->id);
    }

    public function test_can_include_inactive_students(): void
    {
        $activeStudent = User::factory()->create(['role' => 'student']);
        $inactiveStudent = User::factory()->create(['role' => 'student']);

        $this->group->students()->attach($activeStudent->id, [
            'joined_at' => now(),
            'is_active' => true,
        ]);

        $this->group->students()->attach($inactiveStudent->id, [
            'joined_at' => now()->subMonth(),
            'left_at' => now(),
            'is_active' => false,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/groups/{$this->group->id}/students?include_inactive=true");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_students_are_paginated(): void
    {
        $students = User::factory()->count(25)->create(['role' => 'student']);
        foreach ($students as $student) {
            $this->group->students()->attach($student->id, [
                'joined_at' => now(),
                'is_active' => true,
            ]);
        }

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/groups/{$this->group->id}/students");

        $response->assertStatus(200)
            ->assertJsonPath('meta.per_page', 15)
            ->assertJsonCount(15, 'data');
    }

    public function test_returns_404_for_nonexistent_group(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups/99999/students');

        $response->assertStatus(404);
    }
}
