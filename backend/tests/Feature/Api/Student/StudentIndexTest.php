<?php

namespace Tests\Feature\Api\Student;

use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentIndexTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacher;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->teacher()->create();
    }

    public function test_unauthenticated_user_cannot_list_students(): void
    {
        $response = $this->getJson('/api/students');

        $response->assertStatus(401);
    }

    public function test_teacher_can_list_students(): void
    {
        $students = User::factory()->student()->count(3)->create();
        foreach ($students as $student) {
            StudentProfile::factory()->create(['user_id' => $student->id]);
        }

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'email',
                        'phone',
                        'role',
                        'profile',
                        'created_at',
                    ],
                ],
                'links',
                'meta',
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_student_list_is_paginated(): void
    {
        $students = User::factory()->student()->count(20)->create();
        foreach ($students as $student) {
            StudentProfile::factory()->create(['user_id' => $student->id]);
        }

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students?per_page=10');

        $response->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('meta.per_page', 10)
            ->assertJsonPath('meta.total', 20);
    }

    public function test_can_search_students_by_name(): void
    {
        $student1 = User::factory()->student()->create(['name' => 'أحمد محمد']);
        $student2 = User::factory()->student()->create(['name' => 'محمود علي']);
        StudentProfile::factory()->create(['user_id' => $student1->id]);
        StudentProfile::factory()->create(['user_id' => $student2->id]);

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students?search=أحمد');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'أحمد محمد');
    }

    public function test_can_search_students_by_phone(): void
    {
        $student1 = User::factory()->student()->create(['phone' => '+201234567890']);
        $student2 = User::factory()->student()->create(['phone' => '+201111111111']);
        StudentProfile::factory()->create(['user_id' => $student1->id]);
        StudentProfile::factory()->create(['user_id' => $student2->id]);

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students?search=1234567890');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.phone', '+201234567890');
    }

    public function test_can_filter_students_by_status(): void
    {
        $activeStudent = User::factory()->student()->create();
        $inactiveStudent = User::factory()->student()->create();
        StudentProfile::factory()->active()->create(['user_id' => $activeStudent->id]);
        StudentProfile::factory()->inactive()->create(['user_id' => $inactiveStudent->id]);

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students?status=active');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.profile.status', 'active');
    }

    public function test_can_filter_students_by_grade_level(): void
    {
        $student1 = User::factory()->student()->create();
        $student2 = User::factory()->student()->create();
        StudentProfile::factory()->create(['user_id' => $student1->id, 'grade_level' => 'الصف الأول']);
        StudentProfile::factory()->create(['user_id' => $student2->id, 'grade_level' => 'الصف الثاني']);

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students?grade_level=الصف الأول');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.profile.grade_level', 'الصف الأول');
    }

    public function test_can_filter_students_by_is_active(): void
    {
        $activeStudent = User::factory()->student()->create(['is_active' => true]);
        $inactiveStudent = User::factory()->student()->create(['is_active' => false]);
        StudentProfile::factory()->create(['user_id' => $activeStudent->id]);
        StudentProfile::factory()->create(['user_id' => $inactiveStudent->id]);

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students?is_active=true');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.is_active', true);
    }

    public function test_can_sort_students_by_name(): void
    {
        $student1 = User::factory()->student()->create(['name' => 'Zoe']);
        $student2 = User::factory()->student()->create(['name' => 'Alice']);
        StudentProfile::factory()->create(['user_id' => $student1->id]);
        StudentProfile::factory()->create(['user_id' => $student2->id]);

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students?sort_by=name&sort_order=asc');

        $response->assertOk()
            ->assertJsonPath('data.0.name', 'Alice')
            ->assertJsonPath('data.1.name', 'Zoe');
    }

    public function test_only_students_are_listed(): void
    {
        User::factory()->student()->count(2)->create()->each(function ($student) {
            StudentProfile::factory()->create(['user_id' => $student->id]);
        });
        User::factory()->teacher()->create();
        User::factory()->parent()->create();

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/students');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }
}
