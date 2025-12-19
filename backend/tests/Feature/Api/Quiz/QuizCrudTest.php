<?php

namespace Tests\Feature\Api\Quiz;

use App\Models\Group;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizQuestion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class QuizCrudTest extends TestCase
{
    use RefreshDatabase;

    protected User $teacher;
    protected User $student;
    protected Group $group;

    protected function setUp(): void
    {
        parent::setUp();

        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->student = User::factory()->create(['role' => 'student']);
        $this->group = Group::factory()->create();

        Sanctum::actingAs($this->teacher);
    }

    public function test_can_list_quizzes(): void
    {
        Quiz::factory()->count(3)->create(['group_id' => $this->group->id]);

        $response = $this->getJson('/api/quizzes');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_filter_quizzes_by_group(): void
    {
        $group1 = Group::factory()->create();
        $group2 = Group::factory()->create();

        Quiz::factory()->count(2)->create(['group_id' => $group1->id]);
        Quiz::factory()->count(3)->create(['group_id' => $group2->id]);

        $response = $this->getJson('/api/quizzes?group_id=' . $group1->id);

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_filter_quizzes_by_published_status(): void
    {
        Quiz::factory()->count(2)->published()->create(['group_id' => $this->group->id]);
        Quiz::factory()->count(3)->unpublished()->create(['group_id' => $this->group->id]);

        $response = $this->getJson('/api/quizzes?is_published=1');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_can_create_quiz(): void
    {
        $data = [
            'group_id' => $this->group->id,
            'title' => 'اختبار الرياضيات',
            'description' => 'اختبار في الجبر',
            'instructions' => 'أجب عن جميع الأسئلة',
            'duration_minutes' => 30,
            'pass_percentage' => 60,
            'max_attempts' => 2,
            'shuffle_questions' => true,
            'shuffle_answers' => false,
            'show_correct_answers' => true,
            'show_score_immediately' => true,
        ];

        $response = $this->postJson('/api/quizzes', $data);

        $response->assertCreated()
            ->assertJsonPath('data.title', 'اختبار الرياضيات')
            ->assertJsonPath('data.duration_minutes', 30)
            ->assertJsonPath('data.max_attempts', 2);

        $this->assertDatabaseHas('quizzes', [
            'title' => 'اختبار الرياضيات',
            'group_id' => $this->group->id,
        ]);
    }

    public function test_create_quiz_validation(): void
    {
        $response = $this->postJson('/api/quizzes', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'duration_minutes', 'pass_percentage', 'max_attempts']);
    }

    public function test_can_show_quiz(): void
    {
        $quiz = Quiz::factory()->create(['group_id' => $this->group->id]);

        $response = $this->getJson('/api/quizzes/' . $quiz->id);

        $response->assertOk()
            ->assertJsonPath('data.id', $quiz->id)
            ->assertJsonPath('data.title', $quiz->title);
    }

    public function test_can_update_quiz(): void
    {
        $quiz = Quiz::factory()->create(['group_id' => $this->group->id]);

        $response = $this->putJson('/api/quizzes/' . $quiz->id, [
            'title' => 'عنوان محدث',
            'duration_minutes' => 45,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.title', 'عنوان محدث')
            ->assertJsonPath('data.duration_minutes', 45);
    }

    public function test_can_delete_quiz(): void
    {
        $quiz = Quiz::factory()->create(['group_id' => $this->group->id]);

        $response = $this->deleteJson('/api/quizzes/' . $quiz->id);

        $response->assertOk();
        $this->assertDatabaseMissing('quizzes', ['id' => $quiz->id]);
    }

    public function test_can_publish_quiz_with_questions(): void
    {
        $quiz = Quiz::factory()->unpublished()->create(['group_id' => $this->group->id]);
        QuizQuestion::factory()->multipleChoice()->for($quiz)->create();

        $response = $this->postJson('/api/quizzes/' . $quiz->id . '/publish');

        $response->assertOk()
            ->assertJsonPath('data.is_published', true);
    }

    public function test_cannot_publish_quiz_without_questions(): void
    {
        $quiz = Quiz::factory()->unpublished()->create(['group_id' => $this->group->id]);

        $response = $this->postJson('/api/quizzes/' . $quiz->id . '/publish');

        $response->assertUnprocessable();
    }

    public function test_can_unpublish_quiz(): void
    {
        $quiz = Quiz::factory()->published()->create(['group_id' => $this->group->id]);

        $response = $this->postJson('/api/quizzes/' . $quiz->id . '/unpublish');

        $response->assertOk()
            ->assertJsonPath('data.is_published', false);
    }

    public function test_can_duplicate_quiz(): void
    {
        $quiz = Quiz::factory()->create([
            'group_id' => $this->group->id,
            'title' => 'اختبار أصلي',
        ]);
        QuizQuestion::factory()->multipleChoice()->for($quiz)->create();

        $response = $this->postJson('/api/quizzes/' . $quiz->id . '/duplicate');

        $response->assertCreated()
            ->assertJsonPath('data.title', 'اختبار أصلي (نسخة)')
            ->assertJsonPath('data.is_published', false);

        $this->assertDatabaseCount('quizzes', 2);
    }

    public function test_can_add_question_to_quiz(): void
    {
        $quiz = Quiz::factory()->create(['group_id' => $this->group->id]);

        $response = $this->postJson('/api/quizzes/' . $quiz->id . '/questions', [
            'question_text' => 'ما هو 2 + 2؟',
            'question_type' => 'multiple_choice',
            'marks' => 5,
            'options' => [
                ['option_text' => '3', 'is_correct' => false],
                ['option_text' => '4', 'is_correct' => true],
                ['option_text' => '5', 'is_correct' => false],
            ],
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('quiz_questions', [
            'quiz_id' => $quiz->id,
            'question_text' => 'ما هو 2 + 2؟',
        ]);

        $this->assertDatabaseHas('quiz_options', [
            'option_text' => '4',
            'is_correct' => true,
        ]);
    }

    public function test_can_update_question(): void
    {
        $quiz = Quiz::factory()->create(['group_id' => $this->group->id]);
        $question = QuizQuestion::factory()->multipleChoice()->for($quiz)->create();

        $response = $this->putJson('/api/quizzes/' . $quiz->id . '/questions/' . $question->id, [
            'question_text' => 'سؤال محدث',
            'marks' => 10,
        ]);

        $response->assertOk();

        $this->assertDatabaseHas('quiz_questions', [
            'id' => $question->id,
            'question_text' => 'سؤال محدث',
            'marks' => 10,
        ]);
    }

    public function test_can_delete_question(): void
    {
        $quiz = Quiz::factory()->create(['group_id' => $this->group->id]);
        $question = QuizQuestion::factory()->multipleChoice()->for($quiz)->create();

        $response = $this->deleteJson('/api/quizzes/' . $quiz->id . '/questions/' . $question->id);

        $response->assertOk();
        $this->assertDatabaseMissing('quiz_questions', ['id' => $question->id]);
    }

    public function test_can_reorder_questions(): void
    {
        $quiz = Quiz::factory()->create(['group_id' => $this->group->id]);
        $q1 = QuizQuestion::factory()->for($quiz)->create(['order_index' => 1]);
        $q2 = QuizQuestion::factory()->for($quiz)->create(['order_index' => 2]);
        $q3 = QuizQuestion::factory()->for($quiz)->create(['order_index' => 3]);

        $response = $this->postJson('/api/quizzes/' . $quiz->id . '/questions/reorder', [
            'question_ids' => [$q3->id, $q1->id, $q2->id],
        ]);

        $response->assertOk();

        $this->assertEquals(2, $q1->fresh()->order_index);
        $this->assertEquals(3, $q2->fresh()->order_index);
        $this->assertEquals(1, $q3->fresh()->order_index);
    }

    public function test_student_can_start_quiz_attempt(): void
    {
        Sanctum::actingAs($this->student);

        $quiz = Quiz::factory()->available()->create(['group_id' => $this->group->id]);
        QuizQuestion::factory()->multipleChoice()->for($quiz)->create();

        $response = $this->postJson('/api/quizzes/' . $quiz->id . '/start');

        $response->assertCreated()
            ->assertJsonPath('data.status', 'in_progress');

        $this->assertDatabaseHas('quiz_attempts', [
            'quiz_id' => $quiz->id,
            'student_id' => $this->student->id,
            'status' => 'in_progress',
        ]);
    }

    public function test_student_cannot_start_unavailable_quiz(): void
    {
        Sanctum::actingAs($this->student);

        $quiz = Quiz::factory()->unpublished()->create(['group_id' => $this->group->id]);

        $response = $this->postJson('/api/quizzes/' . $quiz->id . '/start');

        $response->assertUnprocessable();
    }

    public function test_student_cannot_exceed_max_attempts(): void
    {
        Sanctum::actingAs($this->student);

        $quiz = Quiz::factory()->available()->create([
            'group_id' => $this->group->id,
            'max_attempts' => 1,
        ]);
        QuizQuestion::factory()->multipleChoice()->for($quiz)->create();

        // Create a completed attempt
        QuizAttempt::factory()->completed()->create([
            'quiz_id' => $quiz->id,
            'student_id' => $this->student->id,
        ]);

        $response = $this->postJson('/api/quizzes/' . $quiz->id . '/start');

        $response->assertUnprocessable();
    }

    public function test_student_can_submit_quiz(): void
    {
        Sanctum::actingAs($this->student);

        $quiz = Quiz::factory()->available()->create(['group_id' => $this->group->id]);
        $question = QuizQuestion::factory()->multipleChoice()->for($quiz)->create();
        $correctOption = $question->options()->where('is_correct', true)->first();

        $attempt = QuizAttempt::factory()->inProgress()->create([
            'quiz_id' => $quiz->id,
            'student_id' => $this->student->id,
        ]);

        $response = $this->postJson('/api/quizzes/' . $quiz->id . '/attempts/' . $attempt->id . '/submit', [
            'answers' => [
                [
                    'question_id' => $question->id,
                    'selected_option_id' => $correctOption->id,
                ],
            ],
        ]);

        $response->assertOk()
            ->assertJsonPath('data.status', 'completed');

        $attempt->refresh();
        $this->assertEquals('completed', $attempt->status);
        $this->assertNotNull($attempt->completed_at);
    }

    public function test_student_can_view_own_attempts(): void
    {
        Sanctum::actingAs($this->student);

        $quiz = Quiz::factory()->create(['group_id' => $this->group->id]);
        QuizAttempt::factory()->count(2)->completed()->create([
            'quiz_id' => $quiz->id,
            'student_id' => $this->student->id,
        ]);

        // Another student's attempt
        QuizAttempt::factory()->completed()->create([
            'quiz_id' => $quiz->id,
            'student_id' => User::factory()->create()->id,
        ]);

        $response = $this->getJson('/api/quizzes/' . $quiz->id . '/my-attempts');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_teacher_can_view_all_attempts(): void
    {
        Sanctum::actingAs($this->teacher);

        $quiz = Quiz::factory()->create(['group_id' => $this->group->id]);
        QuizAttempt::factory()->count(5)->completed()->create([
            'quiz_id' => $quiz->id,
        ]);

        $response = $this->getJson('/api/quizzes/' . $quiz->id . '/attempts');

        $response->assertOk()
            ->assertJsonCount(5, 'data');
    }

    public function test_teacher_can_grade_essay_answer(): void
    {
        Sanctum::actingAs($this->teacher);

        $quiz = Quiz::factory()->create(['group_id' => $this->group->id]);
        $question = QuizQuestion::factory()->essay()->for($quiz)->create(['marks' => 10]);
        $attempt = QuizAttempt::factory()->completed()->create(['quiz_id' => $quiz->id]);
        $answer = $attempt->answers()->create([
            'question_id' => $question->id,
            'answer_text' => 'إجابة الطالب المقالية',
        ]);

        $response = $this->postJson(
            '/api/quizzes/' . $quiz->id . '/attempts/' . $attempt->id . '/answers/' . $answer->id . '/grade',
            [
                'marks_obtained' => 8,
                'is_correct' => true,
            ]
        );

        $response->assertOk();

        $answer->refresh();
        $this->assertEquals(8, $answer->marks_obtained);
        $this->assertTrue($answer->is_correct);
    }

    public function test_quiz_calculates_total_marks(): void
    {
        $quiz = Quiz::factory()->create(['group_id' => $this->group->id, 'total_marks' => 0]);

        QuizQuestion::factory()->for($quiz)->create(['marks' => 5]);
        QuizQuestion::factory()->for($quiz)->create(['marks' => 10]);
        QuizQuestion::factory()->for($quiz)->create(['marks' => 15]);

        $quiz->refresh();
        $this->assertEquals(30, $quiz->total_marks);
    }
}
