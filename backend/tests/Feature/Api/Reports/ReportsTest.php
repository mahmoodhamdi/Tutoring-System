<?php

namespace Tests\Feature\Api\Reports;

use App\Models\Attendance;
use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Group;
use App\Models\Payment;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Session;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReportsTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
    }

    public function test_can_get_report_types(): void
    {
        $response = $this->getJson('/api/reports/types');

        $response->assertOk()
            ->assertJsonCount(6)
            ->assertJsonFragment(['id' => 'attendance'])
            ->assertJsonFragment(['id' => 'payments'])
            ->assertJsonFragment(['id' => 'performance'])
            ->assertJsonFragment(['id' => 'students'])
            ->assertJsonFragment(['id' => 'sessions'])
            ->assertJsonFragment(['id' => 'financial_summary']);
    }

    public function test_can_get_attendance_report(): void
    {
        $group = Group::factory()->create();
        $student = Student::factory()->create();
        $group->students()->attach($student->id);

        $session = Session::factory()->create([
            'group_id' => $group->id,
            'session_date' => now(),
        ]);

        Attendance::factory()->create([
            'session_id' => $session->id,
            'student_id' => $student->id,
            'status' => 'present',
        ]);

        $response = $this->getJson('/api/reports/attendance');

        $response->assertOk()
            ->assertJsonStructure([
                'report_type',
                'period' => ['start_date', 'end_date'],
                'filters',
                'summary' => [
                    'total',
                    'present',
                    'absent',
                    'late',
                    'excused',
                    'attendance_rate',
                ],
                'by_student',
                'data',
            ]);

        $this->assertEquals('attendance', $response->json('report_type'));
        $this->assertEquals(1, $response->json('summary.total'));
        $this->assertEquals(1, $response->json('summary.present'));
    }

    public function test_can_filter_attendance_report(): void
    {
        $group = Group::factory()->create();
        $student = Student::factory()->create();

        $session = Session::factory()->create([
            'group_id' => $group->id,
            'session_date' => now(),
        ]);

        Attendance::factory()->create([
            'session_id' => $session->id,
            'student_id' => $student->id,
            'status' => 'present',
        ]);

        Attendance::factory()->create([
            'session_id' => $session->id,
            'student_id' => Student::factory()->create()->id,
            'status' => 'absent',
        ]);

        // Filter by status
        $response = $this->getJson('/api/reports/attendance?status=present');

        $response->assertOk();
        $this->assertEquals(1, count($response->json('data')));

        // Filter by student
        $response = $this->getJson('/api/reports/attendance?student_id=' . $student->id);

        $response->assertOk();
        $this->assertEquals(1, count($response->json('data')));
    }

    public function test_can_get_payments_report(): void
    {
        $student = Student::factory()->create();

        Payment::factory()->create([
            'student_id' => $student->id,
            'status' => 'paid',
            'amount' => 1000,
        ]);

        Payment::factory()->create([
            'student_id' => $student->id,
            'status' => 'pending',
            'amount' => 500,
        ]);

        $response = $this->getJson('/api/reports/payments');

        $response->assertOk()
            ->assertJsonStructure([
                'report_type',
                'period',
                'filters',
                'summary' => [
                    'total_amount',
                    'paid_amount',
                    'pending_amount',
                    'overdue_amount',
                    'collection_rate',
                ],
                'by_student',
                'by_method',
                'data',
            ]);

        $this->assertEquals('payments', $response->json('report_type'));
        $this->assertEquals(1000, $response->json('summary.paid_amount'));
        $this->assertEquals(500, $response->json('summary.pending_amount'));
    }

    public function test_can_get_performance_report(): void
    {
        $group = Group::factory()->create();
        $student = Student::factory()->create();

        $exam = Exam::factory()->create([
            'group_id' => $group->id,
            'exam_date' => now(),
            'total_marks' => 100,
        ]);

        ExamResult::factory()->create([
            'exam_id' => $exam->id,
            'student_id' => $student->id,
            'obtained_marks' => 80,
            'percentage' => 80,
            'is_passed' => true,
        ]);

        $response = $this->getJson('/api/reports/performance');

        $response->assertOk()
            ->assertJsonStructure([
                'report_type',
                'period',
                'filters',
                'exam_summary' => [
                    'total_exams',
                    'total_results',
                    'average_percentage',
                    'pass_count',
                    'fail_count',
                    'pass_rate',
                ],
                'quiz_summary',
                'by_student',
                'exam_results',
                'quiz_attempts',
            ]);

        $this->assertEquals('performance', $response->json('report_type'));
        $this->assertEquals(80, $response->json('exam_summary.average_percentage'));
    }

    public function test_can_get_students_report(): void
    {
        Student::factory()->count(3)->create(['status' => 'active']);
        Student::factory()->count(2)->create(['status' => 'inactive']);

        $response = $this->getJson('/api/reports/students');

        $response->assertOk()
            ->assertJsonStructure([
                'report_type',
                'filters',
                'summary' => [
                    'total',
                    'active',
                    'inactive',
                    'graduated',
                ],
                'by_grade',
                'data',
            ]);

        $this->assertEquals('students', $response->json('report_type'));
        $this->assertEquals(5, $response->json('summary.total'));
        $this->assertEquals(3, $response->json('summary.active'));
        $this->assertEquals(2, $response->json('summary.inactive'));
    }

    public function test_can_filter_students_report(): void
    {
        Student::factory()->count(3)->create(['status' => 'active']);
        Student::factory()->count(2)->create(['status' => 'inactive']);

        $response = $this->getJson('/api/reports/students?status=active');

        $response->assertOk();
        $this->assertEquals(3, count($response->json('data')));
    }

    public function test_can_get_sessions_report(): void
    {
        $group = Group::factory()->create();

        Session::factory()->create([
            'group_id' => $group->id,
            'session_date' => now(),
            'status' => 'completed',
        ]);

        Session::factory()->create([
            'group_id' => $group->id,
            'session_date' => now()->addDay(),
            'status' => 'scheduled',
        ]);

        $response = $this->getJson('/api/reports/sessions?' . http_build_query([
            'start_date' => now()->startOfMonth()->toDateString(),
            'end_date' => now()->endOfMonth()->toDateString(),
        ]));

        $response->assertOk()
            ->assertJsonStructure([
                'report_type',
                'period',
                'filters',
                'summary' => [
                    'total',
                    'completed',
                    'scheduled',
                    'cancelled',
                    'total_duration_hours',
                ],
                'by_group',
                'data',
            ]);

        $this->assertEquals('sessions', $response->json('report_type'));
    }

    public function test_can_get_financial_summary(): void
    {
        $student = Student::factory()->create();

        Payment::factory()->create([
            'student_id' => $student->id,
            'status' => 'paid',
            'amount' => 1000,
        ]);

        Payment::factory()->create([
            'student_id' => $student->id,
            'status' => 'pending',
            'amount' => 500,
        ]);

        $response = $this->getJson('/api/reports/financial-summary');

        $response->assertOk()
            ->assertJsonStructure([
                'report_type',
                'period',
                'summary' => [
                    'total_revenue',
                    'total_pending',
                    'total_overdue',
                    'total_expected',
                    'collection_rate',
                ],
                'monthly',
                'top_students',
                'outstanding_students',
            ]);

        $this->assertEquals('financial_summary', $response->json('report_type'));
    }

    public function test_can_export_attendance_to_csv(): void
    {
        $group = Group::factory()->create();
        $student = Student::factory()->create();

        $session = Session::factory()->create([
            'group_id' => $group->id,
            'session_date' => now(),
        ]);

        Attendance::factory()->create([
            'session_id' => $session->id,
            'student_id' => $student->id,
            'status' => 'present',
        ]);

        $response = $this->get('/api/reports/export/csv?report_type=attendance');

        $response->assertOk()
            ->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
    }

    public function test_can_export_payments_to_csv(): void
    {
        $student = Student::factory()->create();
        Payment::factory()->create([
            'student_id' => $student->id,
            'status' => 'paid',
        ]);

        $response = $this->get('/api/reports/export/csv?report_type=payments');

        $response->assertOk()
            ->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
    }

    public function test_export_requires_valid_report_type(): void
    {
        $response = $this->getJson('/api/reports/export/csv?report_type=invalid');

        $response->assertStatus(422);
    }

    public function test_requires_authentication(): void
    {
        Sanctum::actingAs(null);
        $this->app['auth']->forgetGuards();

        $this->getJson('/api/reports/types')->assertUnauthorized();
        $this->getJson('/api/reports/attendance')->assertUnauthorized();
        $this->getJson('/api/reports/payments')->assertUnauthorized();
        $this->getJson('/api/reports/performance')->assertUnauthorized();
        $this->getJson('/api/reports/students')->assertUnauthorized();
        $this->getJson('/api/reports/sessions')->assertUnauthorized();
        $this->getJson('/api/reports/financial-summary')->assertUnauthorized();
    }
}
