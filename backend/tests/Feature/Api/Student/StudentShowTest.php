<?php

namespace Tests\Feature\Api\Student;

use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentShowTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacher;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->teacher()->create();
    }

    public function test_unauthenticated_user_cannot_view_student(): void
    {
        $student = User::factory()->student()->create();
        StudentProfile::factory()->create(['user_id' => $student->id]);

        $response = $this->getJson("/api/students/{$student->id}");

        $response->assertStatus(401);
    }

    public function test_teacher_can_view_student(): void
    {
        $parent = User::factory()->parent()->create();
        $student = User::factory()->student()->create();
        StudentProfile::factory()->create([
            'user_id' => $student->id,
            'parent_id' => $parent->id,
            'grade_level' => 'الصف الأول',
            'school_name' => 'مدرسة النجاح',
        ]);

        $response = $this->actingAs($this->teacher)
            ->getJson("/api/students/{$student->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $student->id)
            ->assertJsonPath('data.name', $student->name)
            ->assertJsonPath('data.phone', $student->phone)
            ->assertJsonPath('data.role', 'student')
            ->assertJsonPath('data.profile.grade_level', 'الصف الأول')
            ->assertJsonPath('data.profile.school_name', 'مدرسة النجاح')
            ->assertJsonPath('data.profile.parent.id', $parent->id);
    }

    public function test_student_can_view_own_profile(): void
    {
        $student = User::factory()->student()->create();
        StudentProfile::factory()->create(['user_id' => $student->id]);

        $response = $this->actingAs($student)
            ->getJson("/api/students/{$student->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $student->id);
    }

    public function test_parent_can_view_child_profile(): void
    {
        $parent = User::factory()->parent()->create();
        $student = User::factory()->student()->create();
        StudentProfile::factory()->create([
            'user_id' => $student->id,
            'parent_id' => $parent->id,
        ]);

        $response = $this->actingAs($parent)
            ->getJson("/api/students/{$student->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $student->id);
    }

    public function test_returns_404_for_non_existent_student(): void
    {
        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students/99999');

        $response->assertStatus(404);
    }

    public function test_returns_404_for_non_student_user(): void
    {
        $anotherTeacher = User::factory()->teacher()->create();

        $response = $this->actingAs($this->teacher)
            ->getJson("/api/students/{$anotherTeacher->id}");

        $response->assertStatus(404);
    }

    public function test_response_includes_profile_data(): void
    {
        $student = User::factory()->student()->create();
        StudentProfile::factory()->create([
            'user_id' => $student->id,
            'grade_level' => 'الصف الثاني',
            'school_name' => 'مدرسة المستقبل',
            'address' => 'الإسكندرية',
            'emergency_contact_name' => 'محمد أحمد',
            'emergency_contact_phone' => '+201111111111',
            'notes' => 'ملاحظات هامة',
            'enrollment_date' => '2024-01-15',
            'status' => 'active',
        ]);

        $response = $this->actingAs($this->teacher)
            ->getJson("/api/students/{$student->id}");

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'email',
                    'phone',
                    'role',
                    'date_of_birth',
                    'gender',
                    'is_active',
                    'profile' => [
                        'id',
                        'grade_level',
                        'school_name',
                        'address',
                        'emergency_contact_name',
                        'emergency_contact_phone',
                        'notes',
                        'enrollment_date',
                        'status',
                        'created_at',
                        'updated_at',
                    ],
                    'created_at',
                    'updated_at',
                ],
            ]);
    }
}
