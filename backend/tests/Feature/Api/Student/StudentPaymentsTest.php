<?php

namespace Tests\Feature\Api\Student;

use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentPaymentsTest extends TestCase
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

    public function test_unauthenticated_user_cannot_view_payments(): void
    {
        $response = $this->getJson("/api/students/{$this->student->id}/payments");

        $response->assertStatus(401);
    }

    public function test_teacher_can_view_student_payments(): void
    {
        $response = $this->actingAs($this->teacher)
            ->getJson("/api/students/{$this->student->id}/payments");

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
                    'total_paid',
                    'total_pending',
                    'total_overdue',
                ],
            ]);
    }

    public function test_parent_can_view_child_payments(): void
    {
        $parent = User::factory()->parent()->create();
        $this->student->studentProfile->update(['parent_id' => $parent->id]);

        $response = $this->actingAs($parent)
            ->getJson("/api/students/{$this->student->id}/payments");

        $response->assertOk();
    }

    public function test_returns_404_for_non_existent_student(): void
    {
        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students/99999/payments');

        $response->assertStatus(404);
    }

    public function test_returns_404_for_non_student_user(): void
    {
        $anotherTeacher = User::factory()->teacher()->create();

        $response = $this->actingAs($this->teacher)
            ->getJson("/api/students/{$anotherTeacher->id}/payments");

        $response->assertStatus(404);
    }

    public function test_empty_payments_returns_zero_summary(): void
    {
        $response = $this->actingAs($this->teacher)
            ->getJson("/api/students/{$this->student->id}/payments");

        $response->assertOk()
            ->assertJsonPath('summary.total_paid', 0)
            ->assertJsonPath('summary.total_pending', 0)
            ->assertJsonPath('summary.total_overdue', 0);
    }
}
