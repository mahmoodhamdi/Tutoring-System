<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Http\Requests\Payment\UpdatePaymentRequest;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Payment::with(['student', 'group'])
            ->orderBy('payment_date', 'desc');

        // Filter by student
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        // Filter by group
        if ($request->has('group_id')) {
            $query->where('group_id', $request->group_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment method
        if ($request->has('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        // Filter by period
        if ($request->has('period_month') && $request->has('period_year')) {
            $query->forPeriod($request->period_month, $request->period_year);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('payment_date', [$request->start_date, $request->end_date]);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('receipt_number', 'like', "%{$search}%")
                    ->orWhereHas('student', function ($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        $perPage = min($request->input('per_page', 15), 100);

        return PaymentResource::collection($query->paginate($perPage));
    }

    /**
     * Get pending payments.
     */
    public function pending(Request $request): AnonymousResourceCollection
    {
        $query = Payment::with(['student', 'group'])
            ->pending()
            ->orderBy('payment_date', 'asc');

        if ($request->has('group_id')) {
            $query->where('group_id', $request->group_id);
        }

        $perPage = min($request->input('per_page', 15), 100);

        return PaymentResource::collection($query->paginate($perPage));
    }

    /**
     * Get overdue payments.
     */
    public function overdue(Request $request): AnonymousResourceCollection
    {
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $query = Payment::with(['student', 'group'])
            ->where('status', 'pending')
            ->where(function ($q) use ($currentMonth, $currentYear) {
                $q->where('period_year', '<', $currentYear)
                    ->orWhere(function ($sq) use ($currentMonth, $currentYear) {
                        $sq->where('period_year', $currentYear)
                            ->where('period_month', '<', $currentMonth);
                    });
            })
            ->orderBy('period_year')
            ->orderBy('period_month');

        if ($request->has('group_id')) {
            $query->where('group_id', $request->group_id);
        }

        $perPage = min($request->input('per_page', 15), 100);

        return PaymentResource::collection($query->paginate($perPage));
    }

    /**
     * Store a newly created payment.
     */
    public function store(StorePaymentRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['received_by'] = $request->user()->id;
        $data['receipt_number'] = Payment::generateReceiptNumber();

        $payment = Payment::create($data);

        return response()->json([
            'message' => 'تم تسجيل الدفعة بنجاح',
            'data' => new PaymentResource($payment->load(['student', 'group'])),
        ], 201);
    }

    /**
     * Display the specified payment.
     */
    public function show(Payment $payment): JsonResponse
    {
        return response()->json([
            'data' => new PaymentResource($payment->load(['student', 'group', 'receivedBy'])),
        ]);
    }

    /**
     * Update the specified payment.
     */
    public function update(UpdatePaymentRequest $request, Payment $payment): JsonResponse
    {
        $payment->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث الدفعة بنجاح',
            'data' => new PaymentResource($payment->load(['student', 'group'])),
        ]);
    }

    /**
     * Remove the specified payment.
     */
    public function destroy(Payment $payment): JsonResponse
    {
        $payment->delete();

        return response()->json([
            'message' => 'تم حذف الدفعة بنجاح',
        ]);
    }

    /**
     * Get payment report.
     */
    public function report(Request $request): JsonResponse
    {
        $query = Payment::query();

        // Filter by group
        if ($request->has('group_id')) {
            $query->where('group_id', $request->group_id);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('payment_date', [$request->start_date, $request->end_date]);
        }

        // Filter by period
        if ($request->has('period_month') && $request->has('period_year')) {
            $query->forPeriod($request->period_month, $request->period_year);
        }

        $totalAmount = (clone $query)->where('status', 'paid')->sum('amount');
        $pendingAmount = (clone $query)->where('status', 'pending')->sum('amount');
        $partialAmount = (clone $query)->where('status', 'partial')->sum('amount');

        $paidCount = (clone $query)->where('status', 'paid')->count();
        $pendingCount = (clone $query)->where('status', 'pending')->count();
        $partialCount = (clone $query)->where('status', 'partial')->count();

        // By payment method
        $byMethod = (clone $query)->where('status', 'paid')
            ->selectRaw('payment_method, SUM(amount) as total, COUNT(*) as count')
            ->groupBy('payment_method')
            ->get();

        return response()->json([
            'summary' => [
                'total_collected' => (float) $totalAmount,
                'pending_amount' => (float) $pendingAmount,
                'partial_amount' => (float) $partialAmount,
                'paid_count' => $paidCount,
                'pending_count' => $pendingCount,
                'partial_count' => $partialCount,
            ],
            'by_method' => $byMethod,
        ]);
    }
}
