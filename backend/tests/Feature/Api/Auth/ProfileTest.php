<?php

namespace Tests\Feature\Api\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function authenticated_user_can_get_their_profile(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'email',
                    'phone',
                    'role',
                ],
            ])
            ->assertJsonPath('data.id', $user->id)
            ->assertJsonPath('data.name', $user->name);
    }

    /** @test */
    public function unauthenticated_user_cannot_get_profile(): void
    {
        $response = $this->getJson('/api/auth/me');

        $response->assertStatus(401);
    }

    /** @test */
    public function authenticated_user_can_update_profile(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/auth/profile', [
            'name' => 'Updated Name',
            'address' => '123 Test Street',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Updated Name')
            ->assertJsonPath('data.address', '123 Test Street');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'address' => '123 Test Street',
        ]);
    }

    /** @test */
    public function user_can_update_phone_if_unique(): void
    {
        $user = User::factory()->create(['phone' => '+201111111111']);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/auth/profile', [
            'phone' => '+201999999999',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.phone', '+201999999999');
    }

    /** @test */
    public function user_cannot_update_phone_to_existing_one(): void
    {
        User::factory()->create(['phone' => '+201999999999']);
        $user = User::factory()->create(['phone' => '+201111111111']);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/auth/profile', [
            'phone' => '+201999999999',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    /** @test */
    public function user_can_keep_same_phone_on_update(): void
    {
        $user = User::factory()->create(['phone' => '+201111111111']);
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/auth/profile', [
            'phone' => '+201111111111',
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function authenticated_user_can_change_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('OldPassword123'),
        ]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/auth/change-password', [
            'current_password' => 'OldPassword123',
            'password' => 'NewPassword123',
            'password_confirmation' => 'NewPassword123',
        ]);

        $response->assertStatus(200);

        // Verify new password works
        $this->assertTrue(
            \Illuminate\Support\Facades\Hash::check('NewPassword123', $user->fresh()->password)
        );
    }

    /** @test */
    public function change_password_fails_with_wrong_current_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('OldPassword123'),
        ]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/auth/change-password', [
            'current_password' => 'WrongPassword',
            'password' => 'NewPassword123',
            'password_confirmation' => 'NewPassword123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);
    }

    /** @test */
    public function change_password_fails_with_weak_new_password(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('OldPassword123'),
        ]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/auth/change-password', [
            'current_password' => 'OldPassword123',
            'password' => 'weak',
            'password_confirmation' => 'weak',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /** @test */
    public function authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/auth/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'تم تسجيل الخروج بنجاح']);
    }

    /** @test */
    public function authenticated_user_can_refresh_token(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/auth/refresh');

        $response->assertStatus(200)
            ->assertJsonStructure(['message', 'token']);

        $this->assertNotEmpty($response->json('token'));
    }

    /** @test */
    public function unauthenticated_user_cannot_logout(): void
    {
        $response = $this->postJson('/api/auth/logout');

        $response->assertStatus(401);
    }

    /** @test */
    public function unauthenticated_user_cannot_change_password(): void
    {
        $response = $this->postJson('/api/auth/change-password', [
            'current_password' => 'OldPassword123',
            'password' => 'NewPassword123',
            'password_confirmation' => 'NewPassword123',
        ]);

        $response->assertStatus(401);
    }
}
