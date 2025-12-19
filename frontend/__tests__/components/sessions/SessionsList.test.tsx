import { render, screen } from '@testing-library/react';
import { SessionsList } from '@/components/sessions/SessionsList';
import { Session } from '@/types/session';

const mockSessions: Session[] = [
  {
    id: 1,
    group_id: 1,
    title: 'مراجعة الفصل الأول',
    description: 'مراجعة شاملة',
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
  },
  {
    id: 2,
    group_id: 2,
    title: 'شرح الدرس الثاني',
    description: null,
    scheduled_at: '2024-12-21T16:00:00.000Z',
    end_time: '2024-12-21T17:30:00.000Z',
    duration_minutes: 90,
    status: 'completed',
    location: null,
    notes: null,
    cancelled_at: null,
    cancellation_reason: null,
    is_past: true,
    is_upcoming: false,
    group: {
      id: 2,
      name: 'المجموعة الثانية',
      description: null,
      grade_level: 'الصف الثاني',
      subject: 'العلوم',
      max_students: 15,
      fee_amount: 400,
      schedule_day: 'sunday',
      schedule_time: '16:00:00',
      is_active: true,
      students_count: 8,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    },
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
];

describe('SessionsList', () => {
  it('renders all sessions', () => {
    render(<SessionsList sessions={mockSessions} />);

    expect(screen.getByText('مراجعة الفصل الأول')).toBeInTheDocument();
    expect(screen.getByText('شرح الدرس الثاني')).toBeInTheDocument();
  });

  it('renders group names by default', () => {
    render(<SessionsList sessions={mockSessions} />);

    expect(screen.getByText('المجموعة الأولى')).toBeInTheDocument();
    expect(screen.getByText('المجموعة الثانية')).toBeInTheDocument();
  });

  it('hides group names when showGroup is false', () => {
    render(<SessionsList sessions={mockSessions} showGroup={false} />);

    expect(screen.queryByText('المجموعة الأولى')).not.toBeInTheDocument();
    expect(screen.queryByText('المجموعة الثانية')).not.toBeInTheDocument();
  });

  it('shows empty state when no sessions', () => {
    render(<SessionsList sessions={[]} />);

    expect(screen.getByText('لا توجد جلسات')).toBeInTheDocument();
    expect(screen.getByText('ابدأ بإنشاء جلسة جديدة')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(<SessionsList sessions={[]} emptyMessage="لا توجد جلسات اليوم" />);

    expect(screen.getByText('لا توجد جلسات اليوم')).toBeInTheDocument();
  });

  it('renders create session link in empty state', () => {
    render(<SessionsList sessions={[]} />);

    const link = screen.getByRole('link', { name: 'إنشاء جلسة' });
    expect(link).toHaveAttribute('href', '/dashboard/schedule/new');
  });

  it('renders status badges for each session', () => {
    render(<SessionsList sessions={mockSessions} />);

    expect(screen.getByText('مجدولة')).toBeInTheDocument();
    expect(screen.getByText('مكتملة')).toBeInTheDocument();
  });
});
