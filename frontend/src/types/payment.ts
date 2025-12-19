export type PaymentStatus = 'paid' | 'pending' | 'partial' | 'refunded';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'online';

export interface Payment {
  id: number;
  student_id: number;
  group_id: number | null;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  payment_method_label: string;
  status: PaymentStatus;
  status_label: string;
  period_month: number;
  period_year: number;
  period: string;
  notes: string | null;
  receipt_number: string | null;
  received_by: number | null;
  student?: {
    id: number;
    name: string;
    phone: string;
  };
  group?: {
    id: number;
    name: string;
  } | null;
  received_by_user?: {
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentListParams {
  page?: number;
  per_page?: number;
  student_id?: number;
  group_id?: number;
  status?: PaymentStatus;
  payment_method?: PaymentMethod;
  period_month?: number;
  period_year?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export interface PaymentFormData {
  student_id: number;
  group_id?: number | null;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  period_month: number;
  period_year: number;
  notes?: string | null;
}

export interface PaymentReport {
  summary: {
    total_collected: number;
    pending_amount: number;
    partial_amount: number;
    paid_count: number;
    pending_count: number;
    partial_count: number;
  };
  by_method: {
    payment_method: PaymentMethod;
    total: number;
    count: number;
  }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}
