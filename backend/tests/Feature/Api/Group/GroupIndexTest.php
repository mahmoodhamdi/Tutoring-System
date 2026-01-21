<?php

namespace Tests\Feature\Api\Group;

use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class GroupIndexTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->create(['role' => 'teacher']);
    }

    public function test_guest_cannot_list_groups(): void
    {
        $response = $this->getJson('/api/groups');

        $response->assertStatus(401);
    }

    public function test_teacher_can_list_groups(): void
    {
        Group::factory()->count(3)->create();

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
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
                        'created_at',
                        'updated_at',
                    ],
                ],
                'links',
                'meta',
            ]);
    }

    public function test_groups_are_paginated(): void
    {
        Group::factory()->count(25)->create();

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups');

        $response->assertStatus(200)
            ->assertJsonPath('meta.per_page', 15)
            ->assertJsonCount(15, 'data');
    }

    public function test_can_specify_per_page(): void
    {
        Group::factory()->count(25)->create();

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups?per_page=10');

        $response->assertStatus(200)
            ->assertJsonPath('meta.per_page', 10)
            ->assertJsonCount(10, 'data');
    }

    public function test_can_search_groups_by_name(): void
    {
        Group::factory()->create([
            'name' => 'الرياضيات للصف الأول',
            'subject' => 'رياضيات',
            'description' => 'مجموعة رياضيات',
        ]);
        Group::factory()->create([
            'name' => 'اللغة العربية للصف الثاني',
            'subject' => 'عربي',
            'description' => 'مجموعة عربي',
        ]);
        Group::factory()->create([
            'name' => 'العلوم للصف الثالث',
            'subject' => 'علوم',
            'description' => 'مجموعة علوم',
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups?search=الرياضيات');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'الرياضيات للصف الأول');
    }

    public function test_can_search_groups_by_subject(): void
    {
        Group::factory()->create(['name' => 'مجموعة 1', 'subject' => 'الرياضيات']);
        Group::factory()->create(['name' => 'مجموعة 2', 'subject' => 'الفيزياء']);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups?search=الفيزياء');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.subject', 'الفيزياء');
    }

    public function test_can_filter_by_subject(): void
    {
        Group::factory()->create(['subject' => 'الرياضيات']);
        Group::factory()->create(['subject' => 'الرياضيات']);
        Group::factory()->create(['subject' => 'الفيزياء']);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups?subject=الرياضيات');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_can_filter_by_grade_level(): void
    {
        Group::factory()->create(['grade_level' => 'الصف الأول']);
        Group::factory()->create(['grade_level' => 'الصف الأول']);
        Group::factory()->create(['grade_level' => 'الصف الثاني']);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups?grade_level=' . urlencode('الصف الأول'));

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_can_filter_by_active_status(): void
    {
        Group::factory()->count(3)->create(['is_active' => true]);
        Group::factory()->count(2)->create(['is_active' => false]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups?is_active=true');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');

        $response = $this->getJson('/api/groups?is_active=false');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_only_shows_non_deleted_groups(): void
    {
        Group::factory()->count(3)->create();
        Group::factory()->create()->delete();

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_groups_are_sorted_by_created_at_desc_by_default(): void
    {
        $group1 = Group::factory()->create(['created_at' => now()->subDays(2)]);
        $group2 = Group::factory()->create(['created_at' => now()->subDay()]);
        $group3 = Group::factory()->create(['created_at' => now()]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/groups');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertEquals($group3->id, $data[0]['id']);
        $this->assertEquals($group2->id, $data[1]['id']);
        $this->assertEquals($group1->id, $data[2]['id']);
    }

    public function test_student_can_view_groups(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        Group::factory()->count(3)->create();

        Sanctum::actingAs($student);

        $response = $this->getJson('/api/groups');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }
}
