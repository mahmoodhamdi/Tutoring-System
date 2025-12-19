# Phase 7: Payment System - Implementation Plan

## Overview
Implement payment tracking and management for student fees.

## Database Schema

### payments table
```sql
- id: bigint (PK)
- student_id: bigint (FK to users)
- group_id: bigint (FK to groups, nullable)
- amount: decimal(10,2)
- payment_date: date
- payment_method: enum('cash', 'bank_transfer', 'online')
- status: enum('paid', 'pending', 'partial', 'refunded')
- period_month: int (1-12)
- period_year: int
- notes: text (nullable)
- receipt_number: varchar(50) (nullable)
- received_by: bigint (FK to users)
- created_at: timestamp
- updated_at: timestamp
```

## API Endpoints

### Payment Management
- `GET /api/payments` - List payments with filters
- `GET /api/payments/{id}` - Get payment details
- `POST /api/payments` - Record payment
- `PUT /api/payments/{id}` - Update payment
- `DELETE /api/payments/{id}` - Delete payment
- `GET /api/payments/pending` - Get pending payments
- `GET /api/payments/overdue` - Get overdue payments
- `GET /api/students/{id}/payments` - Get student's payments
- `GET /api/students/{id}/payment-status` - Get student payment status
- `GET /api/payments/report` - Payment report with filters

## Frontend Components
- PaymentsTable - List of payments
- PaymentForm - Record payment form
- PaymentCard - Payment display card
- PaymentStatusBadge - Status indicator
- StudentPaymentHistory - Student's payment history
- PaymentStats - Statistics cards
- PendingPayments - Pending payments widget
- PaymentReceipt - Printable receipt

## Implementation Steps
1. Create Payment model and migration
2. Create PaymentController with endpoints
3. Create request validation classes
4. Create PaymentResource
5. Write backend tests
6. Create frontend types and API
7. Create frontend components and pages
8. Write frontend tests
