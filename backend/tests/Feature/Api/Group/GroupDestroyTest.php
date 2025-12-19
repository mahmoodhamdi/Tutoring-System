<?php

namespace Tests\Feature\Api\Group;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GroupDestroyTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;
    private Group $group;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->group = Group::factory()->create();
    }

    public function test_guest_cannot_delete_group(): void
    {
        $response = $this->deleteJson("/api/groups/{$this->group->id}");

        $response->assertStatus(401);
    }

    public function test_student_cannot_delete_group(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        Sanctum::actingAs($student);

        $response = $this->deleteJson("/api/groups/{$this->group->id}");

        $response->assertStatus(403);
    }

    public function test_teacher_can_delete_group(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->deleteJson("/api/groups/{$this->group->id}");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'تم حذف المجموعة بنجاح',
            ]);

        $this->assertSoftDeleted('groups', [
            'id' => $this->group->id,
        ]);
    }

    public function test_soft_delete_preserves_group_data(): void
    {
        $groupName = $this->group->name;

        Sanctum::actingAs($this->teacher);

        $this->deleteJson("/api/groups/{$this->group->id}");

        $this->assertDatabaseHas('groups', [
            'id' => $this->group->id,
            'name' => $groupName,
        ]);

        $deletedGroup = Group::withTrashed()->find($this->group->id);
        $this->assertNotNull($deletedGroup->deleted_at);
    }

    public function test_cannot_delete_group_with_active_students(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $this->group->students()->attach($student->id, [
            'joined_at' => now(),
            'is_active' => true,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->deleteJson("/api/groups/{$this->group->id}");

        $response->assertStatus(422)
            ->assertJson([
                'message' => 'لا يمكن حذف المجموعة لأنها تحتوي على طلاب نشطين',
            ]);

        $this->assertDatabaseHas('groups', [
            'id' => $this->group->id,
            'deleted_at' => null,
        ]);
    }

    public function test_can_delete_group_with_only_inactive_students(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $this->group->students()->attach($student->id, [
            'joined_at' => now()->subMonth(),
            'left_at' => now(),
            'is_active' => false,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->deleteJson("/api/groups/{$this->group->id}");

        $response->assertStatus(200);

        $this->assertSoftDeleted('groups', [
            'id' => $this->group->id,
        ]);
    }

    public function test_returns_404_for_nonexistent_group(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->deleteJson('/api/groups/99999');

        $response->assertStatus(404);
    }

    public function test_returns_404_for_already_deleted_group(): void
    {
        $this->group->delete();

        Sanctum::actingAs($this->teacher);

        $response = $this->deleteJson("/api/groups/{$this->group->id}");

        $response->assertStatus(404);
    }

    public function test_deleted_group_not_visible_in_list(): void
    {
        $otherGroup = Group::factory()->create();
        $this->group->delete();

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $otherGroup->id);
    }
}
