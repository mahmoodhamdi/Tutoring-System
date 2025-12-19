<?php

namespace Tests\Feature\Api\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'phone' => '+201234567890',
            'password' => bcrypt('Password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'phone' => '+201234567890',
            'password' => 'Password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'phone',
                    'role',
                ],
                'token',
            ]);
    }

    /** @test */
    public function login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'phone' => '+201234567890',
            'password' => bcrypt('Password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'phone' => '+201234567890',
            'password' => 'WrongPassword',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    /** @test */
    public function login_fails_with_nonexistent_phone(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'phone' => '+201234567890',
            'password' => 'Password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    /** @test */
    public function login_fails_without_phone(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'password' => 'Password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    /** @test */
    public function login_fails_without_password(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'phone' => '+201234567890',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /** @test */
    public function login_fails_for_inactive_user(): void
    {
        User::factory()->create([
            'phone' => '+201234567890',
            'password' => bcrypt('Password123'),
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/auth/login', [
            'phone' => '+201234567890',
            'password' => 'Password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    /** @test */
    public function login_returns_token(): void
    {
        User::factory()->create([
            'phone' => '+201234567890',
            'password' => bcrypt('Password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'phone' => '+201234567890',
            'password' => 'Password123',
        ]);

        $response->assertStatus(200);

        $this->assertNotEmpty($response->json('token'));
    }
}
