import { render, screen } from '@testing-library/react';
import { PaymentStats } from '@/components/payments/PaymentStats';

const mockSummary = {
  total_collected: 15000,
  pending_amount: 5000,
  partial_amount: 2500,
  paid_count: 30,
  pending_count: 10,
  partial_count: 5,
};

describe('PaymentStats', () => {
  it('renders total collected amount', () => {
    render(<PaymentStats summary={mockSummary} />);

    expect(screen.getByText('إجمالي المحصل')).toBeInTheDocument();
    expect(screen.getByText('١٥٬٠٠٠ ج.م')).toBeInTheDocument();
  });

  it('renders pending amount', () => {
    render(<PaymentStats summary={mockSummary} />);

    expect(screen.getByText('المبالغ المعلقة')).toBeInTheDocument();
    expect(screen.getByText('٥٬٠٠٠ ج.م')).toBeInTheDocument();
  });

  it('renders partial amount', () => {
    render(<PaymentStats summary={mockSummary} />);

    expect(screen.getByText('المبالغ الجزئية')).toBeInTheDocument();
    expect(screen.getByText('٢٬٥٠٠ ج.م')).toBeInTheDocument();
  });

  it('renders payment counts', () => {
    render(<PaymentStats summary={mockSummary} />);

    expect(screen.getByText('30 دفعة')).toBeInTheDocument();
    expect(screen.getByText('10 دفعة')).toBeInTheDocument();
    expect(screen.getByText('5 دفعة')).toBeInTheDocument();
  });

  it('renders three stat cards', () => {
    render(<PaymentStats summary={mockSummary} />);

    const cards = document.querySelectorAll('.bg-white.rounded-lg.shadow');
    expect(cards.length).toBe(3);
  });

  it('formats amounts in Arabic locale', () => {
    render(<PaymentStats summary={mockSummary} />);

    // Check that amounts are formatted with Arabic numerals
    expect(screen.getByText('١٥٬٠٠٠ ج.م')).toBeInTheDocument();
  });
});
