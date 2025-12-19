<?php

namespace Tests\Feature\Api\Student;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentStoreTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacher;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->teacher()->create();
    }

    public function test_unauthenticated_user_cannot_create_student(): void
    {
        $response = $this->postJson('/api/students', [
            'name' => 'Test Student',
            'phone' => '+201234567890',
            'password' => 'password123',
        ]);

        $response->assertStatus(401);
    }

    public function test_student_cannot_create_student(): void
    {
        $student = User::factory()->student()->create();

        $response = $this->actingAs($student)
            ->postJson('/api/students', [
                'name' => 'Test Student',
                'phone' => '+201234567890',
                'password' => 'password123',
            ]);

        $response->assertStatus(403);
    }

    public function test_parent_cannot_create_student(): void
    {
        $parent = User::factory()->parent()->create();

        $response = $this->actingAs($parent)
            ->postJson('/api/students', [
                'name' => 'Test Student',
                'phone' => '+201234567890',
                'password' => 'password123',
            ]);

        $response->assertStatus(403);
    }

    public function test_teacher_can_create_student_with_minimum_data(): void
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'name' => 'أحمد محمد',
                'phone' => '+201234567890',
                'password' => 'password123',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'أحمد محمد')
            ->assertJsonPath('data.phone', '+201234567890')
            ->assertJsonPath('data.role', 'student')
            ->assertJsonPath('data.profile.status', 'active');

        $this->assertDatabaseHas('users', [
            'name' => 'أحمد محمد',
            'phone' => '+201234567890',
            'role' => 'student',
        ]);

        $this->assertDatabaseHas('student_profiles', [
            'status' => 'active',
        ]);
    }

    public function test_teacher_can_create_student_with_all_data(): void
    {
        $parent = User::factory()->parent()->create();

        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'name' => 'أحمد محمد',
                'email' => 'ahmed@example.com',
                'phone' => '+201234567890',
                'password' => 'password123',
                'date_of_birth' => '2010-05-15',
                'gender' => 'male',
                'is_active' => true,
                'parent_id' => $parent->id,
                'grade_level' => 'الصف الأول',
                'school_name' => 'مدرسة النجاح',
                'address' => 'القاهرة، مصر',
                'emergency_contact_name' => 'والد أحمد',
                'emergency_contact_phone' => '+201111111111',
                'notes' => 'طالب متفوق',
                'enrollment_date' => '2024-09-01',
                'status' => 'active',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'أحمد محمد')
            ->assertJsonPath('data.email', 'ahmed@example.com')
            ->assertJsonPath('data.date_of_birth', '2010-05-15')
            ->assertJsonPath('data.gender', 'male')
            ->assertJsonPath('data.profile.grade_level', 'الصف الأول')
            ->assertJsonPath('data.profile.school_name', 'مدرسة النجاح')
            ->assertJsonPath('data.profile.parent.id', $parent->id);
    }

    public function test_name_is_required(): void
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'phone' => '+201234567890',
                'password' => 'password123',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_phone_is_required(): void
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'name' => 'Test Student',
                'password' => 'password123',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    public function test_password_is_required(): void
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'name' => 'Test Student',
                'phone' => '+201234567890',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_phone_must_be_unique(): void
    {
        User::factory()->create(['phone' => '+201234567890']);

        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'name' => 'Test Student',
                'phone' => '+201234567890',
                'password' => 'password123',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    public function test_email_must_be_unique_if_provided(): void
    {
        User::factory()->create(['email' => 'test@example.com']);

        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'name' => 'Test Student',
                'email' => 'test@example.com',
                'phone' => '+201234567890',
                'password' => 'password123',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_email_must_be_valid_if_provided(): void
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'name' => 'Test Student',
                'email' => 'invalid-email',
                'phone' => '+201234567890',
                'password' => 'password123',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_password_must_be_at_least_8_characters(): void
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'name' => 'Test Student',
                'phone' => '+201234567890',
                'password' => '1234567',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    public function test_parent_id_must_exist(): void
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'name' => 'Test Student',
                'phone' => '+201234567890',
                'password' => 'password123',
                'parent_id' => 99999,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['parent_id']);
    }

    public function test_status_must_be_valid(): void
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'name' => 'Test Student',
                'phone' => '+201234567890',
                'password' => 'password123',
                'status' => 'invalid',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_gender_must_be_valid(): void
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'name' => 'Test Student',
                'phone' => '+201234567890',
                'password' => 'password123',
                'gender' => 'invalid',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['gender']);
    }

    public function test_date_of_birth_must_be_before_today(): void
    {
        $response = $this->actingAs($this->teacher)
            ->postJson('/api/students', [
                'name' => 'Test Student',
                'phone' => '+201234567890',
                'password' => 'password123',
                'date_of_birth' => now()->addDay()->format('Y-m-d'),
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['date_of_birth']);
    }
}
