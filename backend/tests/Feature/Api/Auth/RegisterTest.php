<?php

namespace Tests\Feature\Api\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegisterTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_register_with_valid_data(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+201234567890',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'role' => 'student',
        ]);

        $response->assertStatus(201)
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

        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+201234567890',
            'role' => 'student',
        ]);
    }

    /** @test */
    public function user_can_register_without_email(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'phone' => '+201234567890',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'name' => 'Test User',
            'phone' => '+201234567890',
            'email' => null,
        ]);
    }

    /** @test */
    public function user_defaults_to_student_role(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'phone' => '+201234567890',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'phone' => '+201234567890',
            'role' => 'student',
        ]);
    }

    /** @test */
    public function registration_fails_without_name(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'phone' => '+201234567890',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    /** @test */
    public function registration_fails_without_phone(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    /** @test */
    public function registration_fails_with_duplicate_phone(): void
    {
        User::factory()->create(['phone' => '+201234567890']);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'phone' => '+201234567890',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['phone']);
    }

    /** @test */
    public function registration_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'test@example.com']);

        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+201234567890',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function registration_fails_with_weak_password(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'phone' => '+201234567890',
            'password' => 'weak',
            'password_confirmation' => 'weak',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /** @test */
    public function registration_fails_with_password_mismatch(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'phone' => '+201234567890',
            'password' => 'Password123',
            'password_confirmation' => 'DifferentPassword123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /** @test */
    public function registration_fails_with_invalid_role(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'phone' => '+201234567890',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'role' => 'admin',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['role']);
    }

    /** @test */
    public function user_can_register_as_teacher(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Teacher User',
            'phone' => '+201234567890',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'role' => 'teacher',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'phone' => '+201234567890',
            'role' => 'teacher',
        ]);
    }

    /** @test */
    public function user_can_register_as_parent(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Parent User',
            'phone' => '+201234567890',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'role' => 'parent',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'phone' => '+201234567890',
            'role' => 'parent',
        ]);
    }
}
