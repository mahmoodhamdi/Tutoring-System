<?php

namespace Tests\Feature\Api\Student;

use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentAttendanceTest extends TestCase
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

    public function test_unauthenticated_user_cannot_view_attendance(): void
    {
        $response = $this->getJson("/api/students/{$this->student->id}/attendance");

        $response->assertStatus(401);
    }

    public function test_teacher_can_view_student_attendance(): void
    {
        $response = $this->actingAs($this->teacher)
            ->getJson("/api/students/{$this->student->id}/attendance");

        $response->assertOk()
            ->assertJsonStructure([
                'data',
                'meta' => [
                    'current_page',
                    'last_page',
                    'per_page',
                    'total',
                ],
                'summary' => [
                    'total',
                    'present',
                    'absent',
                    'late',
                    'excused',
                ],
            ]);
    }

    public function test_student_can_view_own_attendance(): void
    {
        $response = $this->actingAs($this->student)
            ->getJson("/api/students/{$this->student->id}/attendance");

        $response->assertOk();
    }

    public function test_parent_can_view_child_attendance(): void
    {
        $parent = User::factory()->parent()->create();
        $this->student->studentProfile->update(['parent_id' => $parent->id]);

        $response = $this->actingAs($parent)
            ->getJson("/api/students/{$this->student->id}/attendance");

        $response->assertOk();
    }

    public function test_returns_404_for_non_existent_student(): void
    {
        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students/99999/attendance');

        $response->assertStatus(404);
    }

    public function test_returns_404_for_non_student_user(): void
    {
        $anotherTeacher = User::factory()->teacher()->create();

        $response = $this->actingAs($this->teacher)
            ->getJson("/api/students/{$anotherTeacher->id}/attendance");

        $response->assertStatus(404);
    }

    public function test_empty_attendance_returns_zero_summary(): void
    {
        $response = $this->actingAs($this->teacher)
            ->getJson("/api/students/{$this->student->id}/attendance");

        $response->assertOk()
            ->assertJsonPath('summary.total', 0)
            ->assertJsonPath('summary.present', 0)
            ->assertJsonPath('summary.absent', 0)
            ->assertJsonPath('summary.late', 0)
            ->assertJsonPath('summary.excused', 0);
    }
}
