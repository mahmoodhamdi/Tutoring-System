<?php

namespace Tests\Feature\Api\Session;

use App\Models\Group;
use App\Models\Session;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SessionCrudTest extends TestCase
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

    public function test_guest_cannot_list_sessions(): void
    {
        $response = $this->getJson('/api/sessions');
        $response->assertStatus(401);
    }

    public function test_teacher_can_list_sessions(): void
    {
        Session::factory()->count(3)->create(['group_id' => $this->group->id]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/sessions');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id', 'group_id', 'title', 'scheduled_at', 'duration_minutes', 'status',
                    ],
                ],
            ]);
    }

    public function test_can_filter_sessions_by_group(): void
    {
        $group2 = Group::factory()->create();
        Session::factory()->count(2)->create(['group_id' => $this->group->id]);
        Session::factory()->count(3)->create(['group_id' => $group2->id]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/sessions?group_id={$this->group->id}");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_can_filter_sessions_by_status(): void
    {
        Session::factory()->count(2)->scheduled()->create(['group_id' => $this->group->id]);
        Session::factory()->count(3)->completed()->create(['group_id' => $this->group->id]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/sessions?status=scheduled');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_teacher_can_create_session(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/sessions', [
            'group_id' => $this->group->id,
            'title' => 'جلسة الرياضيات',
            'description' => 'مراجعة الفصل الأول',
            'scheduled_at' => now()->addDay()->toISOString(),
            'duration_minutes' => 90,
            'location' => 'القاعة 1',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'جلسة الرياضيات')
            ->assertJsonPath('data.duration_minutes', 90)
            ->assertJsonPath('data.status', 'scheduled');
    }

    public function test_student_cannot_create_session(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        Sanctum::actingAs($student);

        $response = $this->postJson('/api/sessions', [
            'group_id' => $this->group->id,
            'title' => 'جلسة الرياضيات',
            'scheduled_at' => now()->addDay()->toISOString(),
        ]);

        $response->assertStatus(403);
    }

    public function test_teacher_can_view_session(): void
    {
        $session = Session::factory()->create(['group_id' => $this->group->id]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/sessions/{$session->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $session->id);
    }

    public function test_teacher_can_update_session(): void
    {
        $session = Session::factory()->create(['group_id' => $this->group->id]);

        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/sessions/{$session->id}", [
            'title' => 'عنوان محدث',
            'duration_minutes' => 120,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.title', 'عنوان محدث')
            ->assertJsonPath('data.duration_minutes', 120);
    }

    public function test_cannot_update_cancelled_session(): void
    {
        $session = Session::factory()->cancelled()->create(['group_id' => $this->group->id]);

        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/sessions/{$session->id}", [
            'title' => 'عنوان محدث',
        ]);

        $response->assertStatus(422);
    }

    public function test_teacher_can_delete_session(): void
    {
        $session = Session::factory()->create(['group_id' => $this->group->id]);

        Sanctum::actingAs($this->teacher);

        $response = $this->deleteJson("/api/sessions/{$session->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('sessions', ['id' => $session->id]);
    }

    public function test_teacher_can_cancel_session(): void
    {
        $session = Session::factory()->scheduled()->create(['group_id' => $this->group->id]);

        Sanctum::actingAs($this->teacher);

        $response = $this->postJson("/api/sessions/{$session->id}/cancel", [
            'reason' => 'عذر طارئ',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'cancelled');

        $session->refresh();
        $this->assertEquals('cancelled', $session->status);
        $this->assertNotNull($session->cancelled_at);
    }

    public function test_teacher_can_complete_session(): void
    {
        $session = Session::factory()->scheduled()->create(['group_id' => $this->group->id]);

        Sanctum::actingAs($this->teacher);

        $response = $this->postJson("/api/sessions/{$session->id}/complete");

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'completed');
    }

    public function test_get_today_sessions(): void
    {
        Session::factory()->today()->create(['group_id' => $this->group->id]);
        Session::factory()->create([
            'group_id' => $this->group->id,
            'scheduled_at' => now()->addDays(5),
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/sessions/today');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_get_upcoming_sessions(): void
    {
        Session::factory()->count(5)->scheduled()->create([
            'group_id' => $this->group->id,
            'scheduled_at' => now()->addDays(rand(1, 30)),
        ]);
        Session::factory()->completed()->create(['group_id' => $this->group->id]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/sessions/upcoming?limit=3');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }
}
