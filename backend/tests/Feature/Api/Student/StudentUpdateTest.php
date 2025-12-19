<?php

namespace Tests\Feature\Api\Student;

use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentUpdateTest extends TestCase
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

    public function test_unauthenticated_user_cannot_update_student(): void
    {
        $response = $this->putJson("/api/students/{$this->student->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(401);
    }

    public function test_student_cannot_update_student(): void
    {
        $anotherStudent = User::factory()->student()->create();

        $response = $this->actingAs($anotherStudent)
            ->putJson("/api/students/{$this->student->id}", [
                'name' => 'Updated Name',
            ]);

        $response->assertStatus(403);
    }

    public function test_parent_cannot_update_student(): void
    {
        $parent = User::factory()->parent()->create();

        $response = $this->actingAs($parent)
            ->putJson("/api/students/{$this->student->id}", [
                'name' => 'Updated Name',
            ]);

        $response->assertStatus(403);
    }

    public function test_teacher_can_update_student_name(): void
    {
        $response = $this->actingAs($this->teacher)
            ->putJson("/api/students/{$this->student->id}", [
                'name' => 'الاسم الجديد',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.name', 'الاسم الجديد');

        $this->assertDatabaseHas('users', [
            'id' => $this->student->id,
            'name' => 'الاسم الجديد',
        ]);
    }

    public function test_teacher_can_update_student_email(): void
    {
        $response = $this->actingAs($this->teacher)
            ->putJson("/api/students/{$this->student->id}", [
                'email' => 'newemail@example.com',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.email', 'newemail@example.com');
    }

    public function test_teacher_can_update_student_phone(): void
    {
        $response = $this->actingAs($this->teacher)
            ->putJson("/api/students/{$this->student->id}", [
                'phone' => '+201999999999',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.phone', '+201999999999');
    }

    public function test_teacher_can_update_student_profile(): void
    {
        $response = $this->actingAs($this->teacher)
            ->putJson("/api/students/{$this->student->id}", [
                'grade_level' => 'الصف الثالث',
                'school_name' => 'مدرسة جديدة',
                'address' => 'عنوان جديد',
                'status' => 'inactive',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.profile.grade_level', 'الصف الثالث')
            ->assertJsonPath('data.profile.school_name', 'مدرسة جديدة')
            ->assertJsonPath('data.profile.address', 'عنوان جديد')
            ->assertJsonPath('data.profile.status', 'inactive');
    }

    public function test_teacher_can_update_student_parent(): void
    {
        $newParent = User::factory()->parent()->create();

        $response = $this->actingAs($this->teacher)
            ->putJson("/api/students/{$this->student->id}", [
                'parent_id' => $newParent->id,
            ]);

        $response->assertOk()
            ->assertJsonPath('data.profile.parent.id', $newParent->id);
    }

    public function test_teacher_can_update_student_password(): void
    {
        $response = $this->actingAs($this->teacher)
            ->putJson("/api/students/{$this->student->id}", [
                'password' => 'newpassword123',
            ]);

        $response->assertOk();

        // Verify new password works
        $this->assertTrue(
            \Illuminate\Support\Facades\Hash::check(
                'newpassword123',
                $this->student->fresh()->password
            )
        );
    }

    public function test_email_must_be_unique_except_current_student(): void
    {
        $anotherUser = User::factory()->create(['email' => 'taken@example.com']);

        $response = $this->actingAs($this->teacher)
            ->putJson("/api/students/{$this->student->id}", [
                'email' => 'taken@example.com',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_student_can_keep_own_email(): void
    {
        $this->student->update(['email' => 'myemail@example.com']);

        $response = $this->actingAs($this->teacher)
            ->putJson("/api/students/{$this->student->id}", [
                'email' => 'myemail@example.com',
                'name' => 'New Name',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.email', 'myemail@example.com');
    }

    public function test_phone_must_be_unique_except_current_student(): void
    {
        User::factory()->create(['phone' => '+201234567890']);

        $response = $this->actingAs($this->teacher)
            ->putJson("/api/students/{$this->student->id}", [
                'phone' => '+201234567890',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    public function test_returns_404_for_non_existent_student(): void
    {
        $response = $this->actingAs($this->teacher)
            ->putJson('/api/students/99999', [
                'name' => 'New Name',
            ]);

        $response->assertStatus(404);
    }

    public function test_returns_404_for_non_student_user(): void
    {
        $anotherTeacher = User::factory()->teacher()->create();

        $response = $this->actingAs($this->teacher)
            ->putJson("/api/students/{$anotherTeacher->id}", [
                'name' => 'New Name',
            ]);

        $response->assertStatus(404);
    }

    public function test_creates_profile_if_not_exists(): void
    {
        $studentWithoutProfile = User::factory()->student()->create();

        $response = $this->actingAs($this->teacher)
            ->putJson("/api/students/{$studentWithoutProfile->id}", [
                'grade_level' => 'الصف الأول',
                'status' => 'active',
            ]);

        $response->assertOk()
            ->assertJsonPath('data.profile.grade_level', 'الصف الأول');

        $this->assertDatabaseHas('student_profiles', [
            'user_id' => $studentWithoutProfile->id,
            'grade_level' => 'الصف الأول',
        ]);
    }
}
