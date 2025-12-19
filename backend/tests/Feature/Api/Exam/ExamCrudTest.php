<?php

namespace Tests\Feature\Api\Exam;

use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\Group;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExamCrudTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacher;
    protected Group $group;

    protected function setUp(): void
    {
        parent::setUp();

        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->group = Group::factory()->create();
    }

    public function test_can_list_exams(): void
    {
        Exam::factory()->count(3)->for($this->group)->create();

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/exams');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_filter_exams_by_group(): void
    {
        $group2 = Group::factory()->create();
        Exam::factory()->count(2)->for($this->group)->create();
        Exam::factory()->count(3)->for($group2)->create();

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/exams?group_id=' . $this->group->id);

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_filter_exams_by_status(): void
    {
        Exam::factory()->count(2)->for($this->group)->scheduled()->create();
        Exam::factory()->for($this->group)->completed()->create();

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/exams?status=scheduled');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_filter_exams_by_type(): void
    {
        Exam::factory()->for($this->group)->quiz()->create();
        Exam::factory()->count(2)->for($this->group)->midterm()->create();

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/exams?exam_type=midterm');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_get_upcoming_exams(): void
    {
        Exam::factory()->count(2)->for($this->group)->scheduled()->published()->create();
        Exam::factory()->for($this->group)->completed()->create();

        $response = $this->actingAs($this->teacher)
            ->getJson('/api/exams/upcoming');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_create_exam(): void
    {
        $data = [
            'group_id' => $this->group->id,
            'title' => 'اختبار الفصل الأول',
            'description' => 'اختبار شامل للفصل الأول',
            'exam_date' => now()->addDays(7)->format('Y-m-d'),
            'start_time' => '14:00',
            'duration_minutes' => 60,
            'total_marks' => 100,
            'pass_marks' => 60,
            'exam_type' => 'midterm',
            'instructions' => 'يجب الإجابة على جميع الأسئلة',
        ];

        $response = $this->actingAs($this->teacher)
            ->postJson('/api/exams', $data);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'اختبار الفصل الأول')
            ->assertJsonPath('data.total_marks', 100);

        $this->assertDatabaseHas('exams', [
            'title' => 'اختبار الفصل الأول',
            'group_id' => $this->group->id,
        ]);
    }

    public function test_cannot_create_exam_with_past_date(): void
    {
        $data = [
            'group_id' => $this->group->id,
            'title' => 'اختبار سابق',
            'exam_date' => now()->subDays(1)->format('Y-m-d'),
            'total_marks' => 100,
            'exam_type' => 'quiz',
        ];

        $response = $this->actingAs($this->teacher)
            ->postJson('/api/exams', $data);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['exam_date']);
    }

    public function test_can_show_exam(): void
    {
        $exam = Exam::factory()->for($this->group)->create();

        $response = $this->actingAs($this->teacher)
            ->getJson("/api/exams/{$exam->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $exam->id);
    }

    public function test_can_update_exam(): void
    {
        $exam = Exam::factory()->for($this->group)->scheduled()->create();

        $response = $this->actingAs($this->teacher)
            ->putJson("/api/exams/{$exam->id}", [
                'title' => 'عنوان محدث',
                'total_marks' => 150,
            ]);

        $response->assertOk()
            ->assertJsonPath('data.title', 'عنوان محدث')
            ->assertJsonPath('data.total_marks', 150);
    }

    public function test_can_delete_exam(): void
    {
        $exam = Exam::factory()->for($this->group)->create();

        $response = $this->actingAs($this->teacher)
            ->deleteJson("/api/exams/{$exam->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('exams', ['id' => $exam->id]);
    }

    public function test_can_publish_exam(): void
    {
        $exam = Exam::factory()->for($this->group)->create(['is_published' => false]);

        $response = $this->actingAs($this->teacher)
            ->postJson("/api/exams/{$exam->id}/publish");

        $response->assertOk()
            ->assertJsonPath('data.is_published', true);
    }

    public function test_can_cancel_exam(): void
    {
        $exam = Exam::factory()->for($this->group)->scheduled()->create();

        $response = $this->actingAs($this->teacher)
            ->postJson("/api/exams/{$exam->id}/cancel");

        $response->assertOk()
            ->assertJsonPath('data.status', 'cancelled');
    }

    public function test_cannot_cancel_completed_exam(): void
    {
        $exam = Exam::factory()->for($this->group)->completed()->create();

        $response = $this->actingAs($this->teacher)
            ->postJson("/api/exams/{$exam->id}/cancel");

        $response->assertStatus(400);
    }

    public function test_can_record_exam_results(): void
    {
        $exam = Exam::factory()->for($this->group)->create(['total_marks' => 100]);
        $students = User::factory()->count(3)->create(['role' => 'student']);
        $this->group->students()->attach($students->pluck('id'));

        $results = [
            ['student_id' => $students[0]->id, 'marks_obtained' => 85, 'status' => 'graded'],
            ['student_id' => $students[1]->id, 'marks_obtained' => 70, 'status' => 'graded'],
            ['student_id' => $students[2]->id, 'status' => 'absent'],
        ];

        $response = $this->actingAs($this->teacher)
            ->postJson("/api/exams/{$exam->id}/results", ['results' => $results]);

        $response->assertOk();

        $this->assertDatabaseHas('exam_results', [
            'exam_id' => $exam->id,
            'student_id' => $students[0]->id,
            'marks_obtained' => 85,
            'status' => 'graded',
        ]);

        $this->assertDatabaseHas('exam_results', [
            'exam_id' => $exam->id,
            'student_id' => $students[2]->id,
            'status' => 'absent',
        ]);
    }

    public function test_can_get_exam_results(): void
    {
        $exam = Exam::factory()->for($this->group)->create();
        $students = User::factory()->count(3)->create(['role' => 'student']);

        foreach ($students as $student) {
            ExamResult::factory()->create([
                'exam_id' => $exam->id,
                'student_id' => $student->id,
            ]);
        }

        $response = $this->actingAs($this->teacher)
            ->getJson("/api/exams/{$exam->id}/results");

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_get_exam_statistics(): void
    {
        $exam = Exam::factory()->for($this->group)->create([
            'total_marks' => 100,
            'pass_marks' => 60,
        ]);

        $students = User::factory()->count(5)->create(['role' => 'student']);
        $this->group->students()->attach($students->pluck('id'));

        // Create graded results
        ExamResult::factory()->create([
            'exam_id' => $exam->id,
            'student_id' => $students[0]->id,
            'marks_obtained' => 90,
            'percentage' => 90,
            'grade' => 'A',
            'status' => 'graded',
        ]);

        ExamResult::factory()->create([
            'exam_id' => $exam->id,
            'student_id' => $students[1]->id,
            'marks_obtained' => 75,
            'percentage' => 75,
            'grade' => 'C+',
            'status' => 'graded',
        ]);

        ExamResult::factory()->create([
            'exam_id' => $exam->id,
            'student_id' => $students[2]->id,
            'marks_obtained' => 50,
            'percentage' => 50,
            'grade' => 'F',
            'status' => 'graded',
        ]);

        $response = $this->actingAs($this->teacher)
            ->getJson("/api/exams/{$exam->id}/statistics");

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'total_students',
                    'graded_count',
                    'average_marks',
                    'pass_count',
                    'fail_count',
                    'pass_rate',
                ],
            ]);
    }

    public function test_can_get_student_exam_history(): void
    {
        $student = User::factory()->create(['role' => 'student']);
        $exams = Exam::factory()->count(3)->for($this->group)->create();

        foreach ($exams as $exam) {
            ExamResult::factory()->graded()->create([
                'exam_id' => $exam->id,
                'student_id' => $student->id,
            ]);
        }

        $response = $this->actingAs($this->teacher)
            ->getJson("/api/students/{$student->id}/exams");

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_grades_are_calculated_correctly(): void
    {
        $exam = Exam::factory()->for($this->group)->create(['total_marks' => 100]);
        $student = User::factory()->create(['role' => 'student']);

        $result = ExamResult::create([
            'exam_id' => $exam->id,
            'student_id' => $student->id,
            'status' => 'pending',
        ]);

        $result->setMarks(95, $this->teacher->id);
        $this->assertEquals('A+', $result->fresh()->grade);

        $result->setMarks(85, $this->teacher->id);
        $this->assertEquals('B+', $result->fresh()->grade);

        $result->setMarks(55, $this->teacher->id);
        $this->assertEquals('F', $result->fresh()->grade);
    }

    public function test_unauthenticated_cannot_access_exams(): void
    {
        $response = $this->getJson('/api/exams');
        $response->assertUnauthorized();
    }
}
