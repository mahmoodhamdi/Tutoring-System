<?php

namespace Tests\Feature\Api\Payment;

use App\Models\Group;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    private User $teacher;
    private User $student;
    private Group $group;

    protected function setUp(): void
    {
        parent::setUp();
        $this->teacher = User::factory()->create(['role' => 'teacher']);
        $this->student = User::factory()->create(['role' => 'student']);
        $this->group = Group::factory()->create();
    }

    public function test_guest_cannot_list_payments(): void
    {
        $response = $this->getJson('/api/payments');
        $response->assertStatus(401);
    }

    public function test_teacher_can_list_payments(): void
    {
        Payment::factory()->count(3)->create([
            'student_id' => $this->student->id,
            'group_id' => $this->group->id,
            'received_by' => $this->teacher->id,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/payments');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id', 'student_id', 'amount', 'payment_date', 'status', 'period',
                    ],
                ],
            ]);
    }

    public function test_can_filter_payments_by_student(): void
    {
        $student2 = User::factory()->create(['role' => 'student']);
        Payment::factory()->count(2)->create([
            'student_id' => $this->student->id,
            'received_by' => $this->teacher->id,
        ]);
        Payment::factory()->count(3)->create([
            'student_id' => $student2->id,
            'received_by' => $this->teacher->id,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/payments?student_id={$this->student->id}");

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_can_filter_payments_by_status(): void
    {
        Payment::factory()->count(2)->paid()->create([
            'student_id' => $this->student->id,
            'received_by' => $this->teacher->id,
        ]);
        Payment::factory()->count(3)->pending()->create([
            'student_id' => $this->student->id,
            'received_by' => $this->teacher->id,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/payments?status=paid');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_teacher_can_create_payment(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/payments', [
            'student_id' => $this->student->id,
            'group_id' => $this->group->id,
            'amount' => 300.00,
            'payment_date' => now()->format('Y-m-d'),
            'payment_method' => 'cash',
            'status' => 'paid',
            'period_month' => 12,
            'period_year' => 2024,
            'notes' => 'دفعة شهر ديسمبر',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.amount', 300.00)
            ->assertJsonPath('data.status', 'paid')
            ->assertJsonPath('data.payment_method', 'cash');

        // Receipt number should be generated
        $this->assertNotNull($response->json('data.receipt_number'));
    }

    public function test_student_cannot_create_payment(): void
    {
        Sanctum::actingAs($this->student);

        $response = $this->postJson('/api/payments', [
            'student_id' => $this->student->id,
            'amount' => 300.00,
            'payment_date' => now()->format('Y-m-d'),
            'payment_method' => 'cash',
            'status' => 'paid',
            'period_month' => 12,
            'period_year' => 2024,
        ]);

        $response->assertStatus(403);
    }

    public function test_teacher_can_view_payment(): void
    {
        $payment = Payment::factory()->create([
            'student_id' => $this->student->id,
            'received_by' => $this->teacher->id,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson("/api/payments/{$payment->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $payment->id);
    }

    public function test_teacher_can_update_payment(): void
    {
        $payment = Payment::factory()->pending()->create([
            'student_id' => $this->student->id,
            'received_by' => $this->teacher->id,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->putJson("/api/payments/{$payment->id}", [
            'status' => 'paid',
            'notes' => 'تم الدفع نقداً',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'paid');
    }

    public function test_teacher_can_delete_payment(): void
    {
        $payment = Payment::factory()->create([
            'student_id' => $this->student->id,
            'received_by' => $this->teacher->id,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->deleteJson("/api/payments/{$payment->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('payments', ['id' => $payment->id]);
    }

    public function test_get_pending_payments(): void
    {
        Payment::factory()->count(2)->pending()->create([
            'student_id' => $this->student->id,
            'received_by' => $this->teacher->id,
        ]);
        Payment::factory()->count(3)->paid()->create([
            'student_id' => $this->student->id,
            'received_by' => $this->teacher->id,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/payments/pending');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_get_overdue_payments(): void
    {
        // Overdue payment (previous month, pending)
        Payment::factory()->pending()->forPeriod(
            now()->subMonth()->month,
            now()->subMonth()->year
        )->create([
            'student_id' => $this->student->id,
            'received_by' => $this->teacher->id,
        ]);

        // Current month pending (not overdue)
        Payment::factory()->pending()->forPeriod(
            now()->month,
            now()->year
        )->create([
            'student_id' => $this->student->id,
            'received_by' => $this->teacher->id,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/payments/overdue');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_get_payment_report(): void
    {
        Payment::factory()->count(3)->paid()->create([
            'student_id' => $this->student->id,
            'amount' => 100,
            'received_by' => $this->teacher->id,
        ]);
        Payment::factory()->count(2)->pending()->create([
            'student_id' => $this->student->id,
            'amount' => 150,
            'received_by' => $this->teacher->id,
        ]);

        Sanctum::actingAs($this->teacher);

        $response = $this->getJson('/api/payments/report');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'summary' => [
                    'total_collected', 'pending_amount', 'partial_amount',
                    'paid_count', 'pending_count', 'partial_count',
                ],
                'by_method',
            ])
            ->assertJsonPath('summary.paid_count', 3)
            ->assertJsonPath('summary.pending_count', 2);
    }

    public function test_payment_validation_requires_amount(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/payments', [
            'student_id' => $this->student->id,
            'payment_date' => now()->format('Y-m-d'),
            'payment_method' => 'cash',
            'status' => 'paid',
            'period_month' => 12,
            'period_year' => 2024,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);
    }

    public function test_payment_amount_must_be_positive(): void
    {
        Sanctum::actingAs($this->teacher);

        $response = $this->postJson('/api/payments', [
            'student_id' => $this->student->id,
            'amount' => 0,
            'payment_date' => now()->format('Y-m-d'),
            'payment_method' => 'cash',
            'status' => 'paid',
            'period_month' => 12,
            'period_year' => 2024,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);
    }
}
