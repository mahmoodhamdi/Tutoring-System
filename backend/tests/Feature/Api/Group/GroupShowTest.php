<?php

namespace Tests\Feature\Api\Group;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GroupShowTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;
    private Group $group;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->group = Group::factory()->create([
            'name' => 'الرياضيات للصف الأول',
            'subject' => 'الرياضيات',
            'grade_level' => 'الصف الأول',
            'max_students' => 20,
            'monthly_fee' => 300.00,
        ]);
    }

    public function test_guest_cannot_view_group(): void
    {
        $response = $this->getJson("/api/groups/{$this->group->id}");

        $response->assertStatus(401);
    }

    public function test_teacher_can_view_group(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/groups/{$this->group->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'description',
                    'subject',
                    'grade_level',
                    'max_students',
                    'monthly_fee',
                    'schedule_description',
                    'is_active',
                    'student_count',
                    'available_spots',
                    'students',
                    'created_at',
                    'updated_at',
                ],
            ])
            ->assertJsonPath('data.id', $this->group->id)
            ->assertJsonPath('data.name', 'الرياضيات للصف الأول')
            ->assertJsonPath('data.subject', 'الرياضيات')
            ->assertJsonPath('data.grade_level', 'الصف الأول')
            ->assertJsonPath('data.max_students', 20)
            ->assertJsonPath('data.monthly_fee', 300);
    }

    public function test_student_can_view_group(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        Sanctum::actingAs($student);

        $response = $this->getJson("/api/groups/{$this->group->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $this->group->id);
    }

    public function test_shows_group_with_active_students(): void
    {
        $students = User::factory()->count(3)->create(['role' => 'student']);

        foreach ($students as $student) {
            $this->group->students()->attach($student->id, [
                'joined_at' => now(),
                'is_active' => true,
            ]);
        }

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/groups/{$this->group->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.student_count', 3)
            ->assertJsonPath('data.available_spots', 17)
            ->assertJsonCount(3, 'data.students');
    }

    public function test_does_not_count_inactive_students(): void
    {
        $activeStudents = User::factory()->count(2)->create(['role' => 'student']);
        $inactiveStudent = User::factory()->create(['role' => 'student']);

        foreach ($activeStudents as $student) {
            $this->group->students()->attach($student->id, [
                'joined_at' => now(),
                'is_active' => true,
            ]);
        }

        $this->group->students()->attach($inactiveStudent->id, [
            'joined_at' => now()->subMonth(),
            'left_at' => now(),
            'is_active' => false,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/groups/{$this->group->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.student_count', 2)
            ->assertJsonPath('data.available_spots', 18)
            ->assertJsonCount(2, 'data.students');
    }

    public function test_returns_404_for_nonexistent_group(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups/99999');

        $response->assertStatus(404);
    }

    public function test_returns_404_for_deleted_group(): void
    {
        $this->group->delete();

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/groups/{$this->group->id}");

        $response->assertStatus(404);
    }
}
