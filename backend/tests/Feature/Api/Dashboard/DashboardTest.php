<?php

namespace Tests\Feature\Api\Dashboard;

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

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
    }

    public function test_can_get_dashboard_stats(): void
    {
        // Create test data
        $group = Group::factory()->create();
        $students = Student::factory()->count(5)->create(['status' => 'active']);
        $group->students()->attach($students->pluck('id'));

        $session = Session::factory()->create([
            'group_id' => $group->id,
            'session_date' => now(),
            'status' => 'completed',
        ]);

        foreach ($students as $student) {
            Attendance::factory()->create([
                'session_id' => $session->id,
                'student_id' => $student->id,
                'status' => 'present',
            ]);

            Payment::factory()->create([
                'student_id' => $student->id,
                'status' => 'paid',
            ]);
        }

        $response = $this->getJson('/api/dashboard');

        $response->assertOk()
            ->assertJsonStructure([
                'overview' => [
                    'total_students',
                    'total_groups',
                    'total_sessions',
                    'total_exams',
                    'total_quizzes',
                    'active_announcements',
                ],
                'students' => [
                    'new',
                    'active',
                    'inactive',
                    'total',
                    'by_grade',
                    'by_group',
                ],
                'sessions' => [
                    'completed',
                    'scheduled',
                    'cancelled',
                    'total',
                    'by_day_of_week',
                    'upcoming',
                ],
                'attendance' => [
                    'present',
                    'absent',
                    'late',
                    'excused',
                    'total',
                    'rate',
                    'trend',
                    'low_attendance_students',
                ],
                'payments' => [
                    'total_paid',
                    'total_pending',
                    'total_overdue',
                    'paid_count',
                    'pending_count',
                    'overdue_count',
                    'collection_rate',
                    'trend',
                    'overdue_students',
                ],
                'performance' => [
                    'exam_average',
                    'exam_pass_rate',
                    'quiz_average',
                    'quiz_pass_rate',
                    'top_performers',
                    'needs_attention',
                    'by_group',
                ],
            ]);

        // Verify counts
        $this->assertEquals(5, $response->json('overview.total_students'));
        $this->assertEquals(1, $response->json('overview.total_groups'));
        $this->assertEquals(1, $response->json('overview.total_sessions'));
    }

    public function test_can_filter_dashboard_by_date(): void
    {
        $lastMonth = now()->subMonth();
        $thisMonth = now();

        // Create old payment
        $student = Student::factory()->create();
        Payment::factory()->create([
            'student_id' => $student->id,
            'status' => 'paid',
            'amount' => 100,
            'created_at' => $lastMonth,
        ]);

        // Create new payment
        Payment::factory()->create([
            'student_id' => $student->id,
            'status' => 'paid',
            'amount' => 200,
            'created_at' => $thisMonth,
        ]);

        // Get stats for this month only
        $response = $this->getJson('/api/dashboard?' . http_build_query([
            'start_date' => $thisMonth->startOfMonth()->toDateString(),
            'end_date' => $thisMonth->endOfMonth()->toDateString(),
        ]));

        $response->assertOk();
        $this->assertEquals(200, $response->json('payments.total_paid'));
    }

    public function test_can_get_quick_stats(): void
    {
        // Create today's session
        Session::factory()->create([
            'session_date' => now()->toDateString(),
            'status' => 'scheduled',
        ]);

        // Create pending payment
        $student = Student::factory()->create();
        Payment::factory()->create([
            'student_id' => $student->id,
            'status' => 'pending',
        ]);

        // Create overdue payment
        Payment::factory()->create([
            'student_id' => $student->id,
            'status' => 'overdue',
        ]);

        $response = $this->getJson('/api/dashboard/quick-stats');

        $response->assertOk()
            ->assertJsonStructure([
                'today_sessions',
                'pending_payments',
                'overdue_payments',
                'unread_notifications',
                'new_students_this_month',
                'upcoming_exams',
            ]);

        $this->assertEquals(1, $response->json('today_sessions'));
        $this->assertEquals(1, $response->json('pending_payments'));
        $this->assertEquals(1, $response->json('overdue_payments'));
    }

    public function test_can_get_recent_activities(): void
    {
        $group = Group::factory()->create();
        $student = Student::factory()->create();

        // Create session
        Session::factory()->create([
            'group_id' => $group->id,
        ]);

        // Create payment
        Payment::factory()->create([
            'student_id' => $student->id,
        ]);

        // Create exam with result
        $exam = Exam::factory()->create([
            'group_id' => $group->id,
        ]);
        ExamResult::factory()->create([
            'exam_id' => $exam->id,
            'student_id' => $student->id,
        ]);

        $response = $this->getJson('/api/dashboard/recent-activities?limit=10');

        $response->assertOk()
            ->assertJsonStructure([
                '*' => [
                    'type',
                    'title',
                    'description',
                    'date',
                    'link',
                ],
            ]);

        // Should have at least 3 activities (session, payment, exam result)
        $this->assertGreaterThanOrEqual(3, count($response->json()));
    }

    public function test_attendance_stats_calculation(): void
    {
        $group = Group::factory()->create();
        $students = Student::factory()->count(4)->create();
        $group->students()->attach($students->pluck('id'));

        $session = Session::factory()->create([
            'group_id' => $group->id,
            'session_date' => now(),
        ]);

        // Create varied attendance
        Attendance::factory()->create([
            'session_id' => $session->id,
            'student_id' => $students[0]->id,
            'status' => 'present',
        ]);
        Attendance::factory()->create([
            'session_id' => $session->id,
            'student_id' => $students[1]->id,
            'status' => 'present',
        ]);
        Attendance::factory()->create([
            'session_id' => $session->id,
            'student_id' => $students[2]->id,
            'status' => 'absent',
        ]);
        Attendance::factory()->create([
            'session_id' => $session->id,
            'student_id' => $students[3]->id,
            'status' => 'late',
        ]);

        $response = $this->getJson('/api/dashboard');

        $response->assertOk();
        $this->assertEquals(2, $response->json('attendance.present'));
        $this->assertEquals(1, $response->json('attendance.absent'));
        $this->assertEquals(1, $response->json('attendance.late'));
        // Rate should be 75% ((2 present + 1 late) / 4 total)
        $this->assertEquals(75, $response->json('attendance.rate'));
    }

    public function test_payment_stats_calculation(): void
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
        Payment::factory()->create([
            'student_id' => $student->id,
            'status' => 'overdue',
            'amount' => 500,
        ]);

        $response = $this->getJson('/api/dashboard');

        $response->assertOk();
        $this->assertEquals(1000, $response->json('payments.total_paid'));
        $this->assertEquals(500, $response->json('payments.total_pending'));
        $this->assertEquals(500, $response->json('payments.total_overdue'));
        // Collection rate should be 50% (1000 / 2000)
        $this->assertEquals(50, $response->json('payments.collection_rate'));
    }

    public function test_performance_stats_calculation(): void
    {
        $group = Group::factory()->create();
        $students = Student::factory()->count(2)->create();
        $group->students()->attach($students->pluck('id'));

        $exam = Exam::factory()->create([
            'group_id' => $group->id,
            'exam_date' => now(),
            'total_marks' => 100,
            'pass_marks' => 50,
        ]);

        // First student - passed with 80%
        ExamResult::factory()->create([
            'exam_id' => $exam->id,
            'student_id' => $students[0]->id,
            'obtained_marks' => 80,
            'percentage' => 80,
            'is_passed' => true,
        ]);

        // Second student - failed with 40%
        ExamResult::factory()->create([
            'exam_id' => $exam->id,
            'student_id' => $students[1]->id,
            'obtained_marks' => 40,
            'percentage' => 40,
            'is_passed' => false,
        ]);

        $response = $this->getJson('/api/dashboard');

        $response->assertOk();
        // Average should be 60%
        $this->assertEquals(60, $response->json('performance.exam_average'));
        // Pass rate should be 50%
        $this->assertEquals(50, $response->json('performance.exam_pass_rate'));
    }

    public function test_requires_authentication(): void
    {
        // Remove authentication
        Sanctum::actingAs(null);
        $this->app['auth']->forgetGuards();

        $response = $this->getJson('/api/dashboard');
        $response->assertUnauthorized();

        $response = $this->getJson('/api/dashboard/quick-stats');
        $response->assertUnauthorized();

        $response = $this->getJson('/api/dashboard/recent-activities');
        $response->assertUnauthorized();
    }
}
