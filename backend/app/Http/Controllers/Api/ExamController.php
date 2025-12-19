<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Exam\StoreExamRequest;
use App\Http\Requests\Exam\UpdateExamRequest;
use App\Http\Requests\Exam\RecordExamResultsRequest;
use App\Http\Resources\ExamResource;
use App\Http\Resources\ExamResultResource;
use App\Models\Exam;
use App\Models\ExamResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ExamController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Exam::with(['group']);

        if ($request->has('group_id')) {
            $query->byGroup($request->group_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('exam_type')) {
            $query->byType($request->exam_type);
        }

        if ($request->has('is_published')) {
            $query->where('is_published', $request->boolean('is_published'));
        }

        if ($request->has('start_date')) {
            $query->where('exam_date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('exam_date', '<=', $request->end_date);
        }

        $sortBy = $request->input('sort_by', 'exam_date');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->input('per_page', 15);
        return ExamResource::collection($query->paginate($perPage));
    }

    public function upcoming(Request $request): AnonymousResourceCollection
    {
        $query = Exam::with(['group'])
            ->upcoming()
            ->published()
            ->orderBy('exam_date', 'asc');

        if ($request->has('group_id')) {
            $query->byGroup($request->group_id);
        }

        $limit = $request->input('limit', 10);
        return ExamResource::collection($query->limit($limit)->get());
    }

    public function recent(Request $request): AnonymousResourceCollection
    {
        $days = $request->input('days', 30);
        $query = Exam::with(['group'])
            ->recent($days)
            ->completed()
            ->orderBy('exam_date', 'desc');

        if ($request->has('group_id')) {
            $query->byGroup($request->group_id);
        }

        $limit = $request->input('limit', 10);
        return ExamResource::collection($query->limit($limit)->get());
    }

    public function store(StoreExamRequest $request): JsonResponse
    {
        $exam = Exam::create($request->validated());

        return response()->json([
            'message' => 'تم إنشاء الاختبار بنجاح',
            'data' => new ExamResource($exam->load('group')),
        ], 201);
    }

    public function show(Exam $exam): ExamResource
    {
        return new ExamResource($exam->load(['group', 'results.student']));
    }

    public function update(UpdateExamRequest $request, Exam $exam): JsonResponse
    {
        $exam->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث الاختبار بنجاح',
            'data' => new ExamResource($exam->fresh()->load('group')),
        ]);
    }

    public function destroy(Exam $exam): JsonResponse
    {
        $exam->delete();

        return response()->json([
            'message' => 'تم حذف الاختبار بنجاح',
        ]);
    }

    public function publish(Exam $exam): JsonResponse
    {
        if ($exam->is_published) {
            return response()->json([
                'message' => 'الاختبار منشور بالفعل',
            ], 400);
        }

        $exam->publish();

        return response()->json([
            'message' => 'تم نشر الاختبار بنجاح',
            'data' => new ExamResource($exam->fresh()->load('group')),
        ]);
    }

    public function cancel(Exam $exam): JsonResponse
    {
        if ($exam->status === 'cancelled') {
            return response()->json([
                'message' => 'الاختبار ملغي بالفعل',
            ], 400);
        }

        if ($exam->status === 'completed') {
            return response()->json([
                'message' => 'لا يمكن إلغاء اختبار مكتمل',
            ], 400);
        }

        $exam->cancel();

        return response()->json([
            'message' => 'تم إلغاء الاختبار بنجاح',
            'data' => new ExamResource($exam->fresh()->load('group')),
        ]);
    }

    public function results(Exam $exam): AnonymousResourceCollection
    {
        $results = $exam->results()->with('student')->get();
        return ExamResultResource::collection($results);
    }

    public function recordResults(RecordExamResultsRequest $request, Exam $exam): JsonResponse
    {
        $results = $request->validated()['results'];
        $gradedBy = $request->user()->id;

        foreach ($results as $resultData) {
            $result = ExamResult::updateOrCreate(
                [
                    'exam_id' => $exam->id,
                    'student_id' => $resultData['student_id'],
                ],
                [
                    'status' => $resultData['status'],
                    'feedback' => $resultData['feedback'] ?? null,
                ]
            );

            if ($resultData['status'] === 'graded' && isset($resultData['marks_obtained'])) {
                $result->setMarks($resultData['marks_obtained'], $gradedBy);
            } elseif ($resultData['status'] === 'absent') {
                $result->markAsAbsent();
            }
        }

        // Mark exam as completed if all students graded
        $group = $exam->group;
        $studentCount = $group->students()->count();
        $gradedCount = $exam->results()->whereIn('status', ['graded', 'absent'])->count();

        if ($studentCount > 0 && $gradedCount >= $studentCount) {
            $exam->complete();
        }

        return response()->json([
            'message' => 'تم تسجيل النتائج بنجاح',
            'data' => ExamResultResource::collection($exam->fresh()->results()->with('student')->get()),
        ]);
    }

    public function updateResult(Request $request, Exam $exam, int $studentId): JsonResponse
    {
        $request->validate([
            'marks_obtained' => 'nullable|numeric|min:0|max:' . $exam->total_marks,
            'status' => 'required|in:pending,submitted,graded,absent',
            'feedback' => 'nullable|string|max:1000',
        ], [
            'marks_obtained.max' => 'الدرجة لا يمكن أن تتجاوز الدرجة الكلية',
            'status.required' => 'حالة النتيجة مطلوبة',
            'status.in' => 'حالة النتيجة غير صالحة',
        ]);

        $result = ExamResult::where('exam_id', $exam->id)
            ->where('student_id', $studentId)
            ->firstOrFail();

        $result->status = $request->status;
        $result->feedback = $request->feedback;

        if ($request->status === 'graded' && $request->has('marks_obtained')) {
            $result->setMarks($request->marks_obtained, $request->user()->id);
        } elseif ($request->status === 'absent') {
            $result->markAsAbsent();
        } else {
            $result->save();
        }

        return response()->json([
            'message' => 'تم تحديث النتيجة بنجاح',
            'data' => new ExamResultResource($result->fresh()->load('student')),
        ]);
    }

    public function studentExams(int $studentId): AnonymousResourceCollection
    {
        $results = ExamResult::with(['exam.group'])
            ->where('student_id', $studentId)
            ->orderByDesc(Exam::select('exam_date')
                ->whereColumn('exams.id', 'exam_results.exam_id'))
            ->get();

        return ExamResultResource::collection($results);
    }

    public function statistics(Exam $exam): JsonResponse
    {
        $results = $exam->results()->where('status', 'graded')->get();

        $stats = [
            'total_students' => $exam->group->students()->count(),
            'graded_count' => $results->count(),
            'absent_count' => $exam->results()->where('status', 'absent')->count(),
            'pending_count' => $exam->results()->where('status', 'pending')->count(),
            'average_marks' => $results->avg('marks_obtained'),
            'average_percentage' => $results->avg('percentage'),
            'highest_marks' => $results->max('marks_obtained'),
            'lowest_marks' => $results->min('marks_obtained'),
            'pass_count' => $results->where('marks_obtained', '>=', $exam->pass_marks ?? ($exam->total_marks * 0.6))->count(),
            'fail_count' => $results->where('marks_obtained', '<', $exam->pass_marks ?? ($exam->total_marks * 0.6))->count(),
            'grade_distribution' => $results->groupBy('grade')->map->count(),
        ];

        if ($stats['graded_count'] > 0) {
            $stats['pass_rate'] = round(($stats['pass_count'] / $stats['graded_count']) * 100, 2);
        } else {
            $stats['pass_rate'] = null;
        }

        return response()->json(['data' => $stats]);
    }
}
