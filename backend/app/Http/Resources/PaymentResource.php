<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'group_id' => $this->group_id,
            'amount' => (float) $this->amount,
            'payment_date' => $this->payment_date?->format('Y-m-d'),
            'payment_method' => $this->payment_method,
            'payment_method_label' => $this->getPaymentMethodLabel(),
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),
            'period_month' => $this->period_month,
            'period_year' => $this->period_year,
            'period' => $this->period,
            'notes' => $this->notes,
            'receipt_number' => $this->receipt_number,
            'received_by' => $this->received_by,
            'student' => $this->when(
                $this->relationLoaded('student'),
                fn() => [
                    'id' => $this->student->id,
                    'name' => $this->student->name,
                    'phone' => $this->student->phone,
                ]
            ),
            'group' => $this->when(
                $this->relationLoaded('group'),
                fn() => $this->group ? [
                    'id' => $this->group->id,
                    'name' => $this->group->name,
                ] : null
            ),
            'received_by_user' => $this->when(
                $this->relationLoaded('receivedBy'),
                fn() => $this->receivedBy ? [
                    'id' => $this->receivedBy->id,
                    'name' => $this->receivedBy->name,
                ] : null
            ),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get the payment method label in Arabic.
     */
    private function getPaymentMethodLabel(): string
    {
        return match ($this->payment_method) {
            'cash' => 'نقداً',
            'bank_transfer' => 'تحويل بنكي',
            'online' => 'دفع إلكتروني',
            default => $this->payment_method,
        };
    }

    /**
     * Get the status label in Arabic.
     */
    private function getStatusLabel(): string
    {
        return match ($this->status) {
            'paid' => 'مدفوع',
            'pending' => 'معلق',
            'partial' => 'جزئي',
            'refunded' => 'مسترد',
            default => $this->status,
        };
    }
}
