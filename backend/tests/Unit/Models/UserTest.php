<?php

namespace Tests\Unit\Models;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_create_a_user(): void
    {
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+201234567890',
            'role' => 'student',
        ]);

        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+201234567890',
            'role' => 'student',
        ]);
    }

    /** @test */
    public function it_can_identify_teacher_role(): void
    {
        $teacher = User::factory()->teacher()->create();

        $this->assertTrue($teacher->isTeacher());
        $this->assertFalse($teacher->isStudent());
        $this->assertFalse($teacher->isParent());
    }

    /** @test */
    public function it_can_identify_student_role(): void
    {
        $student = User::factory()->student()->create();

        $this->assertFalse($student->isTeacher());
        $this->assertTrue($student->isStudent());
        $this->assertFalse($student->isParent());
    }

    /** @test */
    public function it_can_identify_parent_role(): void
    {
        $parent = User::factory()->parent()->create();

        $this->assertFalse($parent->isTeacher());
        $this->assertFalse($parent->isStudent());
        $this->assertTrue($parent->isParent());
    }

    /** @test */
    public function it_can_scope_students(): void
    {
        User::factory()->teacher()->create();
        User::factory()->student()->count(3)->create();
        User::factory()->parent()->create();

        $students = User::students()->get();

        $this->assertCount(3, $students);
        $this->assertTrue($students->every(fn ($user) => $user->role === 'student'));
    }

    /** @test */
    public function it_can_scope_teachers(): void
    {
        User::factory()->teacher()->count(2)->create();
        User::factory()->student()->count(3)->create();

        $teachers = User::teachers()->get();

        $this->assertCount(2, $teachers);
        $this->assertTrue($teachers->every(fn ($user) => $user->role === 'teacher'));
    }

    /** @test */
    public function it_can_scope_active_users(): void
    {
        User::factory()->count(3)->create(['is_active' => true]);
        User::factory()->count(2)->create(['is_active' => false]);

        $activeUsers = User::active()->get();

        $this->assertCount(3, $activeUsers);
        $this->assertTrue($activeUsers->every(fn ($user) => $user->is_active === true));
    }

    /** @test */
    public function it_can_have_a_parent(): void
    {
        $parent = User::factory()->parent()->create();
        $student = User::factory()->student()->create([
            'parent_id' => $parent->id,
        ]);

        $this->assertEquals($parent->id, $student->parent->id);
    }

    /** @test */
    public function parent_can_have_children(): void
    {
        $parent = User::factory()->parent()->create();
        User::factory()->student()->count(2)->create([
            'parent_id' => $parent->id,
        ]);

        $this->assertCount(2, $parent->children);
        $this->assertTrue($parent->children->every(fn ($child) => $child->role === 'student'));
    }

    /** @test */
    public function it_soft_deletes_users(): void
    {
        $user = User::factory()->create();
        $userId = $user->id;

        $user->delete();

        $this->assertSoftDeleted('users', ['id' => $userId]);
        $this->assertNull(User::find($userId));
        $this->assertNotNull(User::withTrashed()->find($userId));
    }

    /** @test */
    public function password_is_hashed(): void
    {
        $user = User::factory()->create([
            'password' => 'plain-password',
        ]);

        $this->assertNotEquals('plain-password', $user->password);
    }

    /** @test */
    public function it_hides_sensitive_attributes(): void
    {
        $user = User::factory()->create();
        $array = $user->toArray();

        $this->assertArrayNotHasKey('password', $array);
        $this->assertArrayNotHasKey('remember_token', $array);
    }
}
