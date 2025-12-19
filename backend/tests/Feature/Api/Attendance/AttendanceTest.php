<?php

namespace Tests\Feature\Api\Attendance;

use App\Models\Attendance;
use App\Models\Group;
use App\Models\Session;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;
    private Group $group;
    private Session $session;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->group = Group::factory()->create();
        $this->session = Session::factory()->create(['group_id' => $this->group->id]);
    }

    public function test_guest_cannot_view_session_attendance(): void
    {
        $response = $this->getJson("/api/sessions/{$this->session->id}/attendance");
        $response->assertStatus(401);
    }

    public function test_teacher_can_view_session_attendance(): void
    {
        $students = User::factory()->count(3)->create(['role' => 'student']);
        foreach ($students as $student) {
            $this->group->students()->attach($student->id, [
                'joined_at' => now(),
                'is_active' => true,
            ]);
        }

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/sessions/{$this->session->id}/attendance");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'session',
                'attendances',
                'summary' => ['total', 'present', 'absent', 'late', 'excused'],
            ])
            ->assertJsonPath('summary.total', 3);
    }

    public function test_teacher_can_record_attendance(): void
    {
        $students = User::factory()->count(3)->create(['role' => 'student']);
        foreach ($students as $student) {
            $this->group->students()->attach($student->id, [
                'joined_at' => now(),
                'is_active' => true,
            ]);
        }

        Sanctum::actingAs($this->teacher);

        $response = $this->postJson("/api/sessions/{$this->session->id}/attendance", [
            'attendances' => [
                ['student_id' => $students[0]->id, 'status' => 'present'],
                ['student_id' => $students[1]->id, 'status' => 'absent'],
                ['student_id' => $students[2]->id, 'status' => 'late', 'notes' => 'تأخر 10 دقائق'],
            ],
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('recorded_count', 3);

        $this->assertDatabaseHas('attendances', [
            'session_id' => $this->session->id,
            'student_id' => $students[0]->id,
            'status' => 'present',
        ]);
    }

    public function test_student_cannot_record_attendance(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        Sanctum::actingAs($student);

        $response = $this->postJson("/api/sessions/{$this->session->id}/attendance", [
            'attendances' => [
                ['student_id' => $student->id, 'status' => 'present'],
            ],
        ]);

        $response->assertStatus(403);
    }

    public function test_cannot_record_attendance_for_cancelled_session(): void
    {
        $this->session->update(['status' => 'cancelled']);
        $student = User::factory()->create(['role' => 'student']);

        Sanctum::actingAs($this->teacher);

        $response = $this->postJson("/api/sessions/{$this->session->id}/attendance", [
            'attendances' => [
                ['student_id' => $student->id, 'status' => 'present'],
            ],
        ]);

        $response->assertStatus(422);
    }

    public function test_can_update_attendance_record(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $attendance = Attendance::create([
            'session_id' => $this->session->id,
            'student_id' => $student->id,
            'status' => 'absent',
            'marked_by' => $this->teacher->id,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/attendance/{$attendance->id}", [
            'status' => 'excused',
            'notes' => 'غياب بعذر طبي',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'excused');
    }

    public function test_can_get_attendance_report(): void
    {
        $student = User::factory()->create(['role' => 'student']);

        // Create multiple attendance records
        Attendance::create([
            'session_id' => $this->session->id,
            'student_id' => $student->id,
            'status' => 'present',
            'marked_by' => $this->teacher->id,
        ]);

        $session2 = Session::factory()->create(['group_id' => $this->group->id]);
        Attendance::create([
            'session_id' => $session2->id,
            'student_id' => $student->id,
            'status' => 'absent',
            'marked_by' => $this->teacher->id,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/attendance/report?student_id={$student->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'summary' => [
                    'total_records', 'present', 'absent', 'late', 'excused', 'attendance_rate',
                ],
            ])
            ->assertJsonPath('summary.total_records', 2)
            ->assertJsonPath('summary.present', 1)
            ->assertJsonPath('summary.absent', 1);
    }

    public function test_can_list_attendance_records(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        Attendance::create([
            'session_id' => $this->session->id,
            'student_id' => $student->id,
            'status' => 'present',
            'marked_by' => $this->teacher->id,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/attendance');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'session_id', 'student_id', 'status'],
                ],
            ]);
    }

    public function test_attendance_updates_on_resubmit(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $this->group->students()->attach($student->id, [
            'joined_at' => now(),
            'is_active' => true,
        ]);

        Sanctum::actingAs($this->teacher);

        // First submission
        $this->postJson("/api/sessions/{$this->session->id}/attendance", [
            'attendances' => [
                ['student_id' => $student->id, 'status' => 'absent'],
            ],
        ]);

        // Second submission (update)
        $response = $this->postJson("/api/sessions/{$this->session->id}/attendance", [
            'attendances' => [
                ['student_id' => $student->id, 'status' => 'present'],
            ],
        ]);

        $response->assertStatus(200);

        // Should only have one record
        $this->assertEquals(1, Attendance::where('session_id', $this->session->id)->count());
        $this->assertDatabaseHas('attendances', [
            'session_id' => $this->session->id,
            'student_id' => $student->id,
            'status' => 'present',
        ]);
    }
}
