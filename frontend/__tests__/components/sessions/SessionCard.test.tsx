import { render, screen } from '@testing-library/react';
import { SessionCard } from '@/components/sessions/SessionCard';
import { Session } from '@/types/session';

const mockSession: Session = {
  id: 1,
  group_id: 1,
  title: 'مراجعة الفصل الأول',
  description: 'مراجعة شاملة للفصل الأول',
  scheduled_at: '2024-12-20T14:00:00.000Z',
  end_time: '2024-12-20T15:00:00.000Z',
  duration_minutes: 60,
  status: 'scheduled',
  location: 'القاعة 1',
  notes: null,
  cancelled_at: null,
  cancellation_reason: null,
  is_past: false,
  is_upcoming: true,
  group: {
    id: 1,
    name: 'المجموعة الأولى',
    description: null,
    grade_level: 'الصف الأول',
    subject: 'الرياضيات',
    max_students: 20,
    fee_amount: 500,
    schedule_day: 'saturday',
    schedule_time: '14:00:00',
    is_active: true,
    students_count: 10,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

describe('SessionCard', () => {
  it('renders session title', () => {
    render(<SessionCard session={mockSession} />);
    expect(screen.getByText('مراجعة الفصل الأول')).toBeInTheDocument();
  });

  it('renders group name when showGroup is true', () => {
    render(<SessionCard session={mockSession} showGroup={true} />);
    expect(screen.getByText('المجموعة الأولى')).toBeInTheDocument();
  });

  it('hides group name when showGroup is false', () => {
    render(<SessionCard session={mockSession} showGroup={false} />);
    expect(screen.queryByText('المجموعة الأولى')).not.toBeInTheDocument();
  });

  it('renders scheduled status badge', () => {
    render(<SessionCard session={mockSession} />);
    expect(screen.getByText('مجدولة')).toBeInTheDocument();
  });

  it('renders completed status badge', () => {
    const completedSession = { ...mockSession, status: 'completed' as const };
    render(<SessionCard session={completedSession} />);
    expect(screen.getByText('مكتملة')).toBeInTheDocument();
  });

  it('renders cancelled status badge', () => {
    const cancelledSession = { ...mockSession, status: 'cancelled' as const };
    render(<SessionCard session={cancelledSession} />);
    expect(screen.getByText('ملغاة')).toBeInTheDocument();
  });

  it('renders duration', () => {
    render(<SessionCard session={mockSession} />);
    expect(screen.getByText(/60 دقيقة/)).toBeInTheDocument();
  });

  it('renders location when provided', () => {
    render(<SessionCard session={mockSession} />);
    expect(screen.getByText('القاعة 1')).toBeInTheDocument();
  });

  it('hides location when not provided', () => {
    const sessionWithoutLocation = { ...mockSession, location: null };
    render(<SessionCard session={sessionWithoutLocation} />);
    expect(screen.queryByText('القاعة 1')).not.toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<SessionCard session={mockSession} />);
    expect(screen.getByText('مراجعة شاملة للفصل الأول')).toBeInTheDocument();
  });

  it('renders as a link to session detail page', () => {
    render(<SessionCard session={mockSession} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard/schedule/1');
  });
});
