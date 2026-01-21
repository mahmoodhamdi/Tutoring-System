<?php

namespace Tests\Feature\Api\Portal;

use App\Models\Announcement;
use App\Models\Attendance;
use App\Models\ExamResult;
use App\Models\Group;
use App\Models\Payment;
use App\Models\Session;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PortalTest extends TestCase
{
    use RefreshDatabase;

    protected User $student;
    protected User $parent;
    protected User $teacher;

    protected function setUp(): void
    {
        parent::setUp();

        $this->teacher = User::factory()->teacher()->create();
        $this->parent = User::factory()->parent()->create();
        $this->student = User::factory()->student()->create([
            'password' => Hash::make('password123'),
        ]);

        // Create student profile with parent link
        StudentProfile::factory()->create([
            'user_id' => $this->student->id,
            'parent_id' => $this->parent->id,
        ]);
    }

    // =====================
    // Login Tests
    // =====================

    public function test_student_can_login_with_email(): void
    {
        $response = $this->postJson('/api/portal/login', [
            'identifier' => $this->student->email,
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_student_can_login_with_phone(): void
    {
        $response = $this->postJson('/api/portal/login', [
            'identifier' => $this->student->phone,
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'user']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $response = $this->postJson('/api/portal/login', [
            'identifier' => $this->student->email,
            'password' => 'wrong_password',
        ]);

        $response->assertUnauthorized();
    }

    public function test_login_fails_with_invalid_identifier(): void
    {
        $response = $this->postJson('/api/portal/login', [
            'identifier' => 'nonexistent@email.com',
            'password' => 'password123',
        ]);

        $response->assertUnauthorized();
    }

    public function test_teacher_cannot_login_to_portal(): void
    {
        $teacher = User::factory()->teacher()->create([
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/portal/login', [
            'identifier' => $teacher->email,
            'password' => 'password123',
        ]);

        $response->assertUnauthorized();
    }

    public function test_inactive_user_cannot_login(): void
    {
        $inactiveStudent = User::factory()->student()->create([
            'password' => Hash::make('password123'),
            'is_active' => false,
        ]);

        $response = $this->postJson('/api/portal/login', [
            'identifier' => $inactiveStudent->email,
            'password' => 'password123',
        ]);

        $response->assertForbidden();
    }

    // =====================
    // Profile Tests
    // =====================

    public function test_student_can_get_profile(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->getJson('/api/portal/profile');

        $response->assertOk()
            ->assertJsonPath('id', $this->student->id)
            ->assertJsonPath('name', $this->student->name)
            ->assertJsonPath('role', 'student');
    }

    public function test_parent_profile_includes_children(): void
    {
        Sanctum::actingAs($this->parent);

        $response = $this->getJson('/api/portal/profile');

        $response->assertOk()
            ->assertJsonPath('role', 'parent')
            ->assertJsonStructure(['children']);
    }

    // =====================
    // Password Update Tests
    // =====================

    public function test_user_can_update_password(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->postJson('/api/portal/password', [
            'current_password' => 'password123',
            'new_password' => 'newpassword123',
            'new_password_confirmation' => 'newpassword123',
        ]);

        $response->assertOk();

        // Verify the password was changed
        $this->student->refresh();
        $this->assertTrue(Hash::check('newpassword123', $this->student->password));
    }

    public function test_password_update_fails_with_wrong_current_password(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->postJson('/api/portal/password', [
            'current_password' => 'wrong_password',
            'new_password' => 'newpassword123',
            'new_password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(400);
    }

    // =====================
    // Dashboard Tests
    // =====================

    public function test_student_can_get_dashboard(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->getJson('/api/portal/dashboard');

        $response->assertOk()
            ->assertJsonStructure([
                'student',
                'attendance',
                'payments',
                'upcoming_sessions',
                'recent_results',
                'announcements',
            ]);
    }

    public function test_parent_can_get_dashboard_for_child(): void
    {
        Sanctum::actingAs($this->parent);

        $response = $this->getJson('/api/portal/dashboard?student_id=' . $this->student->id);

        $response->assertOk()
            ->assertJsonPath('student.id', $this->student->id);
    }

    // =====================
    // Attendance Tests
    // =====================

    public function test_student_can_get_attendance_history(): void
    {
        Sanctum::actingAs($this->student);

        // Create group and session
        $group = Group::factory()->create(['teacher_id' => $this->teacher->id]);
        $group->students()->attach($this->student->id);

        $session = Session::factory()->create(['group_id' => $group->id]);
        Attendance::factory()->create([
            'session_id' => $session->id,
            'student_id' => $this->student->id,
            'status' => 'present',
        ]);

        $response = $this->getJson('/api/portal/attendance');

        $response->assertOk()
            ->assertJsonStructure([
                'summary' => ['total', 'present', 'late', 'absent', 'excused', 'rate'],
                'data',
                'meta',
            ]);
    }

    public function test_attendance_can_be_filtered_by_date(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->getJson('/api/portal/attendance?start_date=2025-01-01&end_date=2025-12-31');

        $response->assertOk();
    }

    // =====================
    // Payments Tests
    // =====================

    public function test_student_can_get_payments(): void
    {
        Sanctum::actingAs($this->student);

        Payment::factory()->count(3)->create([
            'student_id' => $this->student->id,
            'status' => 'paid',
        ]);

        $response = $this->getJson('/api/portal/payments');

        $response->assertOk()
            ->assertJsonStructure([
                'summary' => ['total_paid', 'total_pending', 'total_overdue'],
                'data',
                'meta',
            ]);
    }

    public function test_payments_can_be_filtered_by_status(): void
    {
        Sanctum::actingAs($this->student);

        Payment::factory()->count(2)->create([
            'student_id' => $this->student->id,
            'status' => 'paid',
        ]);
        Payment::factory()->count(3)->create([
            'student_id' => $this->student->id,
            'status' => 'pending',
        ]);

        $response = $this->getJson('/api/portal/payments?status=pending');

        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }

    // =====================
    // Grades Tests
    // =====================

    public function test_student_can_get_grades(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->getJson('/api/portal/grades');

        $response->assertOk()
            ->assertJsonStructure([
                'summary' => ['exam_count', 'exam_average', 'quiz_count', 'quiz_average'],
                'exams',
                'quizzes',
            ]);
    }

    // =====================
    // Schedule Tests
    // =====================

    public function test_student_can_get_schedule(): void
    {
        Sanctum::actingAs($this->student);

        $group = Group::factory()->create(['teacher_id' => $this->teacher->id]);
        $group->students()->attach($this->student->id);

        Session::factory()->count(3)->create([
            'group_id' => $group->id,
            'session_date' => now()->addDays(1),
        ]);

        $response = $this->getJson('/api/portal/schedule');

        $response->assertOk()
            ->assertJsonStructure([
                'period' => ['start_date', 'end_date'],
                'sessions',
            ]);
    }

    public function test_schedule_can_be_filtered_by_date_range(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->getJson('/api/portal/schedule?start_date=2025-01-01&end_date=2025-01-31');

        $response->assertOk()
            ->assertJsonPath('period.start_date', '2025-01-01')
            ->assertJsonPath('period.end_date', '2025-01-31');
    }

    // =====================
    // Announcements Tests
    // =====================

    public function test_can_get_announcements(): void
    {
        Sanctum::actingAs($this->student);

        Announcement::factory()->published()->count(5)->create();

        $response = $this->getJson('/api/portal/announcements');

        $response->assertOk()
            ->assertJsonStructure(['data', 'meta']);
    }

    public function test_can_get_single_announcement(): void
    {
        Sanctum::actingAs($this->student);

        $announcement = Announcement::factory()->published()->create();

        $response = $this->getJson('/api/portal/announcements/' . $announcement->id);

        $response->assertOk()
            ->assertJsonPath('id', $announcement->id);
    }

    public function test_cannot_get_unpublished_announcement(): void
    {
        Sanctum::actingAs($this->student);

        $announcement = Announcement::factory()->draft()->create();

        $response = $this->getJson('/api/portal/announcements/' . $announcement->id);

        $response->assertNotFound();
    }

    // =====================
    // Children Tests (Parent)
    // =====================

    public function test_parent_can_get_children(): void
    {
        Sanctum::actingAs($this->parent);

        $response = $this->getJson('/api/portal/children');

        $response->assertOk()
            ->assertJsonCount(1);
    }

    public function test_student_cannot_access_children_endpoint(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->getJson('/api/portal/children');

        $response->assertForbidden();
    }

    // =====================
    // Logout Tests
    // =====================

    public function test_user_can_logout(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->postJson('/api/portal/logout');

        $response->assertOk();
    }

    // =====================
    // Authorization Tests
    // =====================

    public function test_unauthenticated_cannot_access_protected_routes(): void
    {
        $this->getJson('/api/portal/profile')->assertUnauthorized();
        $this->getJson('/api/portal/dashboard')->assertUnauthorized();
        $this->getJson('/api/portal/attendance')->assertUnauthorized();
        $this->getJson('/api/portal/payments')->assertUnauthorized();
        $this->getJson('/api/portal/grades')->assertUnauthorized();
        $this->getJson('/api/portal/schedule')->assertUnauthorized();
    }

    public function test_parent_cannot_access_other_students_data(): void
    {
        Sanctum::actingAs($this->parent);

        // Create another student not linked to this parent
        $otherStudent = User::factory()->student()->create();
        StudentProfile::factory()->create([
            'user_id' => $otherStudent->id,
            'parent_id' => null, // No parent
        ]);

        $response = $this->getJson('/api/portal/dashboard?student_id=' . $otherStudent->id);

        $response->assertNotFound();
    }
}
