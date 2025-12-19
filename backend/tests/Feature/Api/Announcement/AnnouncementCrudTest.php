<?php

namespace Tests\Feature\Api\Announcement;

use App\Models\Announcement;
use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AnnouncementCrudTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacher;
    protected User $student;
    protected Group $group;

    protected function setUp(): void
    {
        parent::setUp();

        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->student = User::factory()->create(['role' => 'student']);
        $this->group = Group::factory()->create();

        Sanctum::actingAs($this->teacher);
    }

    public function test_can_list_announcements(): void
    {
        Announcement::factory()->count(3)->published()->create(['user_id' => $this->teacher->id]);

        $response = $this->getJson('/api/announcements');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_filter_announcements_by_group(): void
    {
        $group1 = Group::factory()->create();
        $group2 = Group::factory()->create();

        Announcement::factory()->count(2)->published()->create([
            'user_id' => $this->teacher->id,
            'group_id' => $group1->id,
        ]);
        Announcement::factory()->count(3)->published()->create([
            'user_id' => $this->teacher->id,
            'group_id' => $group2->id,
        ]);

        $response = $this->getJson('/api/announcements?group_id=' . $group1->id);

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_filter_announcements_by_priority(): void
    {
        Announcement::factory()->count(2)->published()->withPriority('urgent')->create(['user_id' => $this->teacher->id]);
        Announcement::factory()->count(3)->published()->withPriority('normal')->create(['user_id' => $this->teacher->id]);

        $response = $this->getJson('/api/announcements?priority=urgent');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_filter_announcements_by_type(): void
    {
        Announcement::factory()->count(2)->published()->ofType('exam')->create(['user_id' => $this->teacher->id]);
        Announcement::factory()->count(3)->published()->ofType('general')->create(['user_id' => $this->teacher->id]);

        $response = $this->getJson('/api/announcements?type=exam');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_create_announcement(): void
    {
        $data = [
            'title' => 'إعلان هام',
            'content' => 'محتوى الإعلان الهام',
            'priority' => 'high',
            'type' => 'general',
            'group_id' => $this->group->id,
        ];

        $response = $this->postJson('/api/announcements', $data);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'إعلان هام')
            ->assertJsonPath('data.priority', 'high')
            ->assertJsonPath('data.is_published', false);

        $this->assertDatabaseHas('announcements', [
            'title' => 'إعلان هام',
            'user_id' => $this->teacher->id,
        ]);
    }

    public function test_can_create_and_publish_announcement(): void
    {
        $data = [
            'title' => 'إعلان فوري',
            'content' => 'محتوى الإعلان',
            'publish' => true,
        ];

        $response = $this->postJson('/api/announcements', $data);

        $response->assertCreated()
            ->assertJsonPath('data.is_published', true);
    }

    public function test_create_announcement_validation(): void
    {
        $response = $this->postJson('/api/announcements', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'content']);
    }

    public function test_can_show_announcement(): void
    {
        $announcement = Announcement::factory()->published()->create(['user_id' => $this->teacher->id]);

        $response = $this->getJson('/api/announcements/' . $announcement->id);

        $response->assertOk()
            ->assertJsonPath('data.id', $announcement->id)
            ->assertJsonPath('data.title', $announcement->title);
    }

    public function test_can_update_announcement(): void
    {
        $announcement = Announcement::factory()->create(['user_id' => $this->teacher->id]);

        $response = $this->putJson('/api/announcements/' . $announcement->id, [
            'title' => 'عنوان محدث',
            'content' => 'محتوى محدث',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.title', 'عنوان محدث');
    }

    public function test_can_delete_announcement(): void
    {
        $announcement = Announcement::factory()->create(['user_id' => $this->teacher->id]);

        $response = $this->deleteJson('/api/announcements/' . $announcement->id);

        $response->assertOk();
        $this->assertSoftDeleted('announcements', ['id' => $announcement->id]);
    }

    public function test_can_publish_announcement(): void
    {
        $announcement = Announcement::factory()->draft()->create(['user_id' => $this->teacher->id]);

        $response = $this->postJson('/api/announcements/' . $announcement->id . '/publish');

        $response->assertOk()
            ->assertJsonPath('data.is_published', true);

        $announcement->refresh();
        $this->assertTrue($announcement->is_published);
        $this->assertNotNull($announcement->published_at);
    }

    public function test_can_unpublish_announcement(): void
    {
        $announcement = Announcement::factory()->published()->create(['user_id' => $this->teacher->id]);

        $response = $this->postJson('/api/announcements/' . $announcement->id . '/unpublish');

        $response->assertOk()
            ->assertJsonPath('data.is_published', false);
    }

    public function test_can_pin_announcement(): void
    {
        $announcement = Announcement::factory()->published()->create([
            'user_id' => $this->teacher->id,
            'is_pinned' => false,
        ]);

        $response = $this->postJson('/api/announcements/' . $announcement->id . '/pin');

        $response->assertOk()
            ->assertJsonPath('data.is_pinned', true);
    }

    public function test_can_unpin_announcement(): void
    {
        $announcement = Announcement::factory()->published()->pinned()->create(['user_id' => $this->teacher->id]);

        $response = $this->postJson('/api/announcements/' . $announcement->id . '/unpin');

        $response->assertOk()
            ->assertJsonPath('data.is_pinned', false);
    }

    public function test_can_mark_announcement_as_read(): void
    {
        $announcement = Announcement::factory()->published()->create(['user_id' => $this->teacher->id]);

        $response = $this->postJson('/api/announcements/' . $announcement->id . '/read');

        $response->assertOk();
        $this->assertTrue($announcement->isReadBy($this->teacher->id));
    }

    public function test_can_mark_all_announcements_as_read(): void
    {
        Announcement::factory()->count(3)->published()->create(['user_id' => $this->teacher->id]);

        $response = $this->postJson('/api/announcements/mark-all-read');

        $response->assertOk()
            ->assertJsonPath('count', 3);
    }

    public function test_can_get_recent_announcements(): void
    {
        Announcement::factory()->count(10)->published()->create(['user_id' => $this->teacher->id]);

        $response = $this->getJson('/api/announcements/recent?limit=5');

        $response->assertOk()
            ->assertJsonCount(5, 'data');
    }

    public function test_can_get_unread_announcements(): void
    {
        $announcements = Announcement::factory()->count(3)->published()->create(['user_id' => $this->teacher->id]);

        // Mark one as read
        $announcements[0]->markAsRead($this->teacher->id);

        $response = $this->getJson('/api/announcements/unread');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_get_announcement_statistics(): void
    {
        Announcement::factory()->count(3)->published()->create(['user_id' => $this->teacher->id]);
        Announcement::factory()->count(2)->draft()->create(['user_id' => $this->teacher->id]);

        $response = $this->getJson('/api/announcements/statistics');

        $response->assertOk()
            ->assertJsonPath('data.total', 5)
            ->assertJsonPath('data.published', 3)
            ->assertJsonPath('data.drafts', 2);
    }

    public function test_expired_announcements_not_shown_in_active(): void
    {
        Announcement::factory()->count(2)->published()->create(['user_id' => $this->teacher->id]);
        Announcement::factory()->expired()->create(['user_id' => $this->teacher->id]);

        $response = $this->getJson('/api/announcements?active_only=1');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_pinned_announcements_appear_first(): void
    {
        $normalAnnouncement = Announcement::factory()->published()->create([
            'user_id' => $this->teacher->id,
            'is_pinned' => false,
            'title' => 'Normal',
        ]);
        $pinnedAnnouncement = Announcement::factory()->published()->pinned()->create([
            'user_id' => $this->teacher->id,
            'title' => 'Pinned',
        ]);

        $response = $this->getJson('/api/announcements');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertEquals('Pinned', $data[0]['title']);
    }
}
