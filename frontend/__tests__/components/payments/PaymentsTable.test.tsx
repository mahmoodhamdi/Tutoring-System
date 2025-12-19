import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentsTable } from '@/components/payments/PaymentsTable';
import { Payment } from '@/types/payment';

const mockPayments: Payment[] = [
  {
    id: 1,
    student_id: 1,
    group_id: 1,
    amount: 500,
    payment_date: '2024-12-15',
    payment_method: 'cash',
    payment_method_label: 'نقداً',
    status: 'paid',
    status_label: 'مدفوع',
    period_month: 12,
    period_year: 2024,
    period: 'ديسمبر 2024',
    notes: null,
    receipt_number: 'REC-001',
    received_by: null,
    student: {
      id: 1,
      name: 'أحمد محمد',
      phone: '+201234567890',
    },
    group: null,
    created_at: '2024-12-15T10:00:00.000Z',
    updated_at: '2024-12-15T10:00:00.000Z',
  },
  {
    id: 2,
    student_id: 2,
    group_id: 1,
    amount: 250,
    payment_date: '2024-12-16',
    payment_method: 'bank_transfer',
    payment_method_label: 'تحويل بنكي',
    status: 'partial',
    status_label: 'جزئي',
    period_month: 12,
    period_year: 2024,
    period: 'ديسمبر 2024',
    notes: 'دفعة جزئية',
    receipt_number: 'REC-002',
    received_by: null,
    student: {
      id: 2,
      name: 'سارة علي',
      phone: '+201234567891',
    },
    group: null,
    created_at: '2024-12-16T10:00:00.000Z',
    updated_at: '2024-12-16T10:00:00.000Z',
  },
];

describe('PaymentsTable', () => {
  it('renders payments correctly', () => {
    render(<PaymentsTable payments={mockPayments} />);

    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
    expect(screen.getByText('سارة علي')).toBeInTheDocument();
  });

  it('renders student phone numbers', () => {
    render(<PaymentsTable payments={mockPayments} />);

    expect(screen.getByText('+201234567890')).toBeInTheDocument();
    expect(screen.getByText('+201234567891')).toBeInTheDocument();
  });

  it('renders amounts with currency', () => {
    render(<PaymentsTable payments={mockPayments} />);

    expect(screen.getByText('٥٠٠ ج.م')).toBeInTheDocument();
    expect(screen.getByText('٢٥٠ ج.م')).toBeInTheDocument();
  });

  it('renders payment methods', () => {
    render(<PaymentsTable payments={mockPayments} />);

    expect(screen.getByText('نقداً')).toBeInTheDocument();
    expect(screen.getByText('تحويل بنكي')).toBeInTheDocument();
  });

  it('renders status badges', () => {
    render(<PaymentsTable payments={mockPayments} />);

    expect(screen.getByText('مدفوع')).toBeInTheDocument();
    expect(screen.getByText('جزئي')).toBeInTheDocument();
  });

  it('renders period information', () => {
    render(<PaymentsTable payments={mockPayments} />);

    const periods = screen.getAllByText('ديسمبر 2024');
    expect(periods.length).toBe(2);
  });

  it('shows empty state when no payments', () => {
    render(<PaymentsTable payments={[]} />);

    expect(screen.getByText('لا توجد مدفوعات')).toBeInTheDocument();
    expect(screen.getByText('ابدأ بتسجيل دفعة جديدة')).toBeInTheDocument();
  });

  it('renders create payment link in empty state', () => {
    render(<PaymentsTable payments={[]} />);

    const link = screen.getByRole('link', { name: 'تسجيل دفعة' });
    expect(link).toHaveAttribute('href', '/dashboard/payments/new');
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn();
    render(<PaymentsTable payments={mockPayments} onDelete={handleDelete} />);

    const deleteButtons = screen.getAllByTitle('حذف');
    fireEvent.click(deleteButtons[0]);

    expect(handleDelete).toHaveBeenCalledWith(mockPayments[0]);
  });

  it('renders view links for each payment', () => {
    render(<PaymentsTable payments={mockPayments} />);

    const viewLinks = screen.getAllByTitle('عرض');
    expect(viewLinks).toHaveLength(2);
  });

  it('disables delete button when isDeleting is true', () => {
    const handleDelete = jest.fn();
    render(
      <PaymentsTable
        payments={mockPayments}
        onDelete={handleDelete}
        isDeleting={true}
      />
    );

    const deleteButtons = screen.getAllByTitle('حذف');
    expect(deleteButtons[0]).toBeDisabled();
  });
});
