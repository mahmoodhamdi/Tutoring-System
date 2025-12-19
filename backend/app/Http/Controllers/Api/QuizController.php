<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Quiz\StoreQuizRequest;
use App\Http\Requests\Quiz\UpdateQuizRequest;
use App\Http\Requests\Quiz\AddQuestionRequest;
use App\Http\Requests\Quiz\UpdateQuestionRequest;
use App\Http\Requests\Quiz\SubmitQuizRequest;
use App\Http\Resources\QuizResource;
use App\Http\Resources\QuizAttemptResource;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizAttempt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class QuizController extends Controller
{
    /**
     * Display a listing of quizzes.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Quiz::with(['group', 'questions.options']);

        // Filter by group
        if ($request->has('group_id')) {
            $query->where('group_id', $request->group_id);
        }

        // Filter by published status
        if ($request->has('is_published')) {
            $query->where('is_published', $request->boolean('is_published'));
        }

        // Filter by availability
        if ($request->boolean('available_only')) {
            $query->available();
        }

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $quizzes = $query->orderBy('created_at', 'desc')->paginate($request->get('per_page', 15));

        return QuizResource::collection($quizzes);
    }

    /**
     * Store a newly created quiz.
     */
    public function store(StoreQuizRequest $request): JsonResponse
    {
        $quiz = Quiz::create($request->validated());

        return response()->json([
            'message' => 'تم إنشاء الاختبار بنجاح',
            'data' => new QuizResource($quiz->load(['group', 'questions.options'])),
        ], 201);
    }

    /**
     * Display the specified quiz.
     */
    public function show(Quiz $quiz): QuizResource
    {
        return new QuizResource($quiz->load(['group', 'questions.options', 'attempts.student']));
    }

    /**
     * Update the specified quiz.
     */
    public function update(UpdateQuizRequest $request, Quiz $quiz): JsonResponse
    {
        $quiz->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث الاختبار بنجاح',
            'data' => new QuizResource($quiz->load(['group', 'questions.options'])),
        ]);
    }

    /**
     * Remove the specified quiz.
     */
    public function destroy(Quiz $quiz): JsonResponse
    {
        $quiz->delete();

        return response()->json([
            'message' => 'تم حذف الاختبار بنجاح',
        ]);
    }

    /**
     * Publish the quiz.
     */
    public function publish(Quiz $quiz): JsonResponse
    {
        if ($quiz->questions()->count() === 0) {
            return response()->json([
                'message' => 'لا يمكن نشر اختبار بدون أسئلة',
            ], 422);
        }

        $quiz->publish();

        return response()->json([
            'message' => 'تم نشر الاختبار بنجاح',
            'data' => new QuizResource($quiz->load(['group', 'questions.options'])),
        ]);
    }

    /**
     * Unpublish the quiz.
     */
    public function unpublish(Quiz $quiz): JsonResponse
    {
        $quiz->unpublish();

        return response()->json([
            'message' => 'تم إلغاء نشر الاختبار بنجاح',
            'data' => new QuizResource($quiz->load(['group', 'questions.options'])),
        ]);
    }

    /**
     * Duplicate the quiz.
     */
    public function duplicate(Quiz $quiz): JsonResponse
    {
        $newQuiz = $quiz->duplicate();

        return response()->json([
            'message' => 'تم نسخ الاختبار بنجاح',
            'data' => new QuizResource($newQuiz->load(['group', 'questions.options'])),
        ], 201);
    }

    /**
     * Add a question to the quiz.
     */
    public function addQuestion(AddQuestionRequest $request, Quiz $quiz): JsonResponse
    {
        $questionData = $request->safe()->except('options');
        $questionData['quiz_id'] = $quiz->id;
        $questionData['order_index'] = $quiz->questions()->count() + 1;

        $question = QuizQuestion::create($questionData);

        // Create options if provided
        if ($request->has('options')) {
            foreach ($request->options as $index => $optionData) {
                $question->options()->create([
                    'option_text' => $optionData['option_text'],
                    'is_correct' => $optionData['is_correct'] ?? false,
                    'order_index' => $index + 1,
                ]);
            }
        }

        return response()->json([
            'message' => 'تم إضافة السؤال بنجاح',
            'data' => new QuizResource($quiz->fresh()->load(['group', 'questions.options'])),
        ], 201);
    }

    /**
     * Update a question.
     */
    public function updateQuestion(UpdateQuestionRequest $request, Quiz $quiz, QuizQuestion $question): JsonResponse
    {
        if ($question->quiz_id !== $quiz->id) {
            return response()->json([
                'message' => 'السؤال لا ينتمي لهذا الاختبار',
            ], 422);
        }

        $questionData = $request->safe()->except('options');
        $question->update($questionData);

        // Update options if provided
        if ($request->has('options')) {
            // Delete existing options
            $question->options()->delete();

            // Create new options
            foreach ($request->options as $index => $optionData) {
                $question->options()->create([
                    'option_text' => $optionData['option_text'],
                    'is_correct' => $optionData['is_correct'] ?? false,
                    'order_index' => $index + 1,
                ]);
            }
        }

        return response()->json([
            'message' => 'تم تحديث السؤال بنجاح',
            'data' => new QuizResource($quiz->fresh()->load(['group', 'questions.options'])),
        ]);
    }

    /**
     * Delete a question.
     */
    public function deleteQuestion(Quiz $quiz, QuizQuestion $question): JsonResponse
    {
        if ($question->quiz_id !== $quiz->id) {
            return response()->json([
                'message' => 'السؤال لا ينتمي لهذا الاختبار',
            ], 422);
        }

        $question->delete();

        // Reorder remaining questions
        $quiz->questions()->orderBy('order_index')->get()->each(function ($q, $index) {
            $q->update(['order_index' => $index + 1]);
        });

        return response()->json([
            'message' => 'تم حذف السؤال بنجاح',
            'data' => new QuizResource($quiz->fresh()->load(['group', 'questions.options'])),
        ]);
    }

    /**
     * Reorder questions.
     */
    public function reorderQuestions(Request $request, Quiz $quiz): JsonResponse
    {
        $request->validate([
            'question_ids' => 'required|array',
            'question_ids.*' => 'exists:quiz_questions,id',
        ]);

        foreach ($request->question_ids as $index => $questionId) {
            QuizQuestion::where('id', $questionId)
                ->where('quiz_id', $quiz->id)
                ->update(['order_index' => $index + 1]);
        }

        return response()->json([
            'message' => 'تم إعادة ترتيب الأسئلة بنجاح',
            'data' => new QuizResource($quiz->fresh()->load(['group', 'questions.options'])),
        ]);
    }

    /**
     * Start a quiz attempt for the authenticated student.
     */
    public function startAttempt(Quiz $quiz): JsonResponse
    {
        $user = auth()->user();

        // Check if quiz is available
        if (!$quiz->is_available) {
            return response()->json([
                'message' => 'الاختبار غير متاح حالياً',
            ], 422);
        }

        // Check if student can attempt
        if (!$quiz->canStudentAttempt($user->id)) {
            return response()->json([
                'message' => 'لقد استنفدت عدد المحاولات المسموح بها',
            ], 422);
        }

        // Check for existing in-progress attempt
        $existingAttempt = QuizAttempt::where('quiz_id', $quiz->id)
            ->where('student_id', $user->id)
            ->where('status', 'in_progress')
            ->first();

        if ($existingAttempt) {
            return response()->json([
                'message' => 'لديك محاولة قيد التنفيذ',
                'data' => new QuizAttemptResource($existingAttempt->load(['quiz.questions.options', 'answers'])),
            ]);
        }

        // Create new attempt
        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'student_id' => $user->id,
            'started_at' => now(),
            'status' => 'in_progress',
        ]);

        // Load quiz with questions (shuffled if enabled)
        $quizData = $quiz->load(['questions.options']);

        if ($quiz->shuffle_questions) {
            $quizData->setRelation('questions', $quizData->questions->shuffle());
        }

        if ($quiz->shuffle_answers) {
            $quizData->questions->each(function ($question) {
                $question->setRelation('options', $question->options->shuffle());
            });
        }

        return response()->json([
            'message' => 'تم بدء الاختبار',
            'data' => new QuizAttemptResource($attempt->load(['quiz.questions.options', 'answers'])),
        ], 201);
    }

    /**
     * Submit a quiz attempt.
     */
    public function submitAttempt(SubmitQuizRequest $request, Quiz $quiz, QuizAttempt $attempt): JsonResponse
    {
        $user = auth()->user();

        // Validate attempt belongs to user
        if ($attempt->student_id !== $user->id) {
            return response()->json([
                'message' => 'هذه المحاولة لا تخصك',
            ], 403);
        }

        // Validate attempt is in progress
        if ($attempt->status !== 'in_progress') {
            return response()->json([
                'message' => 'هذه المحاولة مكتملة بالفعل',
            ], 422);
        }

        // Check if timed out
        if ($attempt->is_timed_out) {
            $attempt->timeout();
            return response()->json([
                'message' => 'انتهى وقت الاختبار',
                'data' => new QuizAttemptResource($attempt->load(['quiz', 'answers.question', 'answers.selectedOption'])),
            ]);
        }

        // Save answers
        foreach ($request->answers as $answerData) {
            $answer = $attempt->answers()->updateOrCreate(
                ['question_id' => $answerData['question_id']],
                [
                    'selected_option_id' => $answerData['selected_option_id'] ?? null,
                    'answer_text' => $answerData['answer_text'] ?? null,
                ]
            );
            $answer->grade();
        }

        // Submit the attempt
        $attempt->submit();

        return response()->json([
            'message' => 'تم تسليم الاختبار بنجاح',
            'data' => new QuizAttemptResource($attempt->load(['quiz', 'answers.question', 'answers.selectedOption'])),
        ]);
    }

    /**
     * Get quiz attempts for a student.
     */
    public function studentAttempts(Quiz $quiz): AnonymousResourceCollection
    {
        $user = auth()->user();

        $attempts = QuizAttempt::where('quiz_id', $quiz->id)
            ->where('student_id', $user->id)
            ->with(['answers.question', 'answers.selectedOption'])
            ->orderBy('created_at', 'desc')
            ->get();

        return QuizAttemptResource::collection($attempts);
    }

    /**
     * Get all attempts for a quiz (teacher view).
     */
    public function allAttempts(Quiz $quiz): AnonymousResourceCollection
    {
        $attempts = QuizAttempt::where('quiz_id', $quiz->id)
            ->with(['student', 'answers.question', 'answers.selectedOption'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return QuizAttemptResource::collection($attempts);
    }

    /**
     * Get a specific attempt with details.
     */
    public function showAttempt(Quiz $quiz, QuizAttempt $attempt): JsonResponse
    {
        if ($attempt->quiz_id !== $quiz->id) {
            return response()->json([
                'message' => 'هذه المحاولة لا تنتمي لهذا الاختبار',
            ], 422);
        }

        return response()->json([
            'data' => new QuizAttemptResource($attempt->load([
                'quiz.questions.options',
                'student',
                'answers.question.options',
                'answers.selectedOption',
            ])),
        ]);
    }

    /**
     * Grade an essay answer manually.
     */
    public function gradeAnswer(Request $request, Quiz $quiz, QuizAttempt $attempt, int $answerId): JsonResponse
    {
        $request->validate([
            'marks_obtained' => 'required|numeric|min:0',
            'is_correct' => 'required|boolean',
        ]);

        $answer = $attempt->answers()->findOrFail($answerId);

        if ($answer->question->question_type !== 'essay') {
            return response()->json([
                'message' => 'هذا السؤال ليس مقالياً',
            ], 422);
        }

        $answer->update([
            'marks_obtained' => $request->marks_obtained,
            'is_correct' => $request->is_correct,
        ]);

        // Recalculate attempt score
        $attempt->calculateScore();
        $attempt->save();

        return response()->json([
            'message' => 'تم تقييم الإجابة بنجاح',
            'data' => new QuizAttemptResource($attempt->load(['quiz', 'answers.question', 'answers.selectedOption'])),
        ]);
    }
}
