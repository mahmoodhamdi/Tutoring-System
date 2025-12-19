<?php

namespace Tests\Feature\Api\Notification;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class NotificationCrudTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
    }

    public function test_can_list_notifications(): void
    {
        Notification::factory()->count(5)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/notifications');

        $response->assertOk()
            ->assertJsonCount(5, 'data');
    }

    public function test_can_filter_notifications_by_read_status(): void
    {
        Notification::factory()->count(3)->unread()->create(['user_id' => $this->user->id]);
        Notification::factory()->count(2)->read()->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/notifications?is_read=0');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_filter_notifications_by_type(): void
    {
        Notification::factory()->count(2)->sessionReminder()->create(['user_id' => $this->user->id]);
        Notification::factory()->count(3)->paymentDue()->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/notifications?type=session_reminder');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_get_unread_count(): void
    {
        Notification::factory()->count(5)->unread()->create(['user_id' => $this->user->id]);
        Notification::factory()->count(3)->read()->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/notifications/unread-count');

        $response->assertOk()
            ->assertJsonPath('data.count', 5);
    }

    public function test_can_get_recent_notifications(): void
    {
        Notification::factory()->count(10)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/notifications/recent?limit=5');

        $response->assertOk()
            ->assertJsonCount(5, 'data');
    }

    public function test_can_show_notification(): void
    {
        $notification = Notification::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/notifications/' . $notification->id);

        $response->assertOk()
            ->assertJsonPath('data.id', $notification->id);
    }

    public function test_cannot_show_other_users_notification(): void
    {
        $otherUser = User::factory()->create();
        $notification = Notification::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->getJson('/api/notifications/' . $notification->id);

        $response->assertForbidden();
    }

    public function test_can_mark_notification_as_read(): void
    {
        $notification = Notification::factory()->unread()->create(['user_id' => $this->user->id]);

        $response = $this->postJson('/api/notifications/' . $notification->id . '/read');

        $response->assertOk()
            ->assertJsonPath('data.is_read', true);

        $notification->refresh();
        $this->assertTrue($notification->is_read);
        $this->assertNotNull($notification->read_at);
    }

    public function test_can_mark_notification_as_unread(): void
    {
        $notification = Notification::factory()->read()->create(['user_id' => $this->user->id]);

        $response = $this->postJson('/api/notifications/' . $notification->id . '/unread');

        $response->assertOk()
            ->assertJsonPath('data.is_read', false);

        $notification->refresh();
        $this->assertFalse($notification->is_read);
        $this->assertNull($notification->read_at);
    }

    public function test_can_mark_all_as_read(): void
    {
        Notification::factory()->count(5)->unread()->create(['user_id' => $this->user->id]);

        $response = $this->postJson('/api/notifications/mark-all-read');

        $response->assertOk()
            ->assertJsonPath('count', 5);

        $unreadCount = Notification::where('user_id', $this->user->id)->unread()->count();
        $this->assertEquals(0, $unreadCount);
    }

    public function test_can_delete_notification(): void
    {
        $notification = Notification::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson('/api/notifications/' . $notification->id);

        $response->assertOk();
        $this->assertDatabaseMissing('notifications', ['id' => $notification->id]);
    }

    public function test_cannot_delete_other_users_notification(): void
    {
        $otherUser = User::factory()->create();
        $notification = Notification::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->deleteJson('/api/notifications/' . $notification->id);

        $response->assertForbidden();
    }

    public function test_can_delete_all_read_notifications(): void
    {
        Notification::factory()->count(3)->read()->create(['user_id' => $this->user->id]);
        Notification::factory()->count(2)->unread()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson('/api/notifications/read');

        $response->assertOk()
            ->assertJsonPath('count', 3);

        $totalCount = Notification::where('user_id', $this->user->id)->count();
        $this->assertEquals(2, $totalCount);
    }

    public function test_can_send_test_notification(): void
    {
        $response = $this->postJson('/api/notifications/test');

        $response->assertOk();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->user->id,
            'type' => 'general',
            'title' => 'إشعار تجريبي',
        ]);
    }

    public function test_can_get_notification_preferences(): void
    {
        $response = $this->getJson('/api/notifications/preferences');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'session_reminder',
                    'payment_due',
                    'exam_reminder',
                    'announcement',
                ],
            ]);
    }

    public function test_can_update_notification_preferences(): void
    {
        $response = $this->putJson('/api/notifications/preferences', [
            'session_reminder' => false,
            'payment_due' => true,
        ]);

        $response->assertOk();
    }

    public function test_notifications_are_ordered_by_created_at_desc(): void
    {
        $old = Notification::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => now()->subDay(),
        ]);
        $new = Notification::factory()->create([
            'user_id' => $this->user->id,
            'created_at' => now(),
        ]);

        $response = $this->getJson('/api/notifications');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertEquals($new->id, $data[0]['id']);
        $this->assertEquals($old->id, $data[1]['id']);
    }
}
