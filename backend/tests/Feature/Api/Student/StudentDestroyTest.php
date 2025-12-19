<?php

namespace Tests\Feature\Api\Student;

use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentDestroyTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacher;
    protected User $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->teacher()->create();
        $this->student = User::factory()->student()->create();
        StudentProfile::factory()->create(['user_id' => $this->student->id]);
    }

    public function test_unauthenticated_user_cannot_delete_student(): void
    {
        $response = $this->deleteJson("/api/students/{$this->student->id}");

        $response->assertStatus(401);
    }

    public function test_student_cannot_delete_student(): void
    {
        $anotherStudent = User::factory()->student()->create();

        $response = $this->actingAs($anotherStudent)
            ->deleteJson("/api/students/{$this->student->id}");

        $response->assertStatus(403);
    }

    public function test_parent_cannot_delete_student(): void
    {
        $parent = User::factory()->parent()->create();

        $response = $this->actingAs($parent)
            ->deleteJson("/api/students/{$this->student->id}");

        $response->assertStatus(403);
    }

    public function test_teacher_can_delete_student(): void
    {
        $response = $this->actingAs($this->teacher)
            ->deleteJson("/api/students/{$this->student->id}");

        $response->assertOk()
            ->assertJson([
                'message' => 'تم حذف الطالب بنجاح',
            ]);

        // Soft delete check
        $this->assertSoftDeleted('users', [
            'id' => $this->student->id,
        ]);
    }

    public function test_returns_404_for_non_existent_student(): void
    {
        $response = $this->actingAs($this->teacher)
            ->deleteJson('/api/students/99999');

        $response->assertStatus(404);
    }

    public function test_returns_404_for_non_student_user(): void
    {
        $anotherTeacher = User::factory()->teacher()->create();

        $response = $this->actingAs($this->teacher)
            ->deleteJson("/api/students/{$anotherTeacher->id}");

        $response->assertStatus(404);
    }

    public function test_deleted_student_not_in_list(): void
    {
        $this->actingAs($this->teacher)
            ->deleteJson("/api/students/{$this->student->id}");

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students');

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }
}
