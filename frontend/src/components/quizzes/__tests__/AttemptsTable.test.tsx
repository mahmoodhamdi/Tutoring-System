import { render, screen } from '@testing-library/react';
import { AttemptsTable } from '../AttemptsTable';
import { QuizAttempt } from '@/types/quiz';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const mockAttempts: QuizAttempt[] = [
  {
    id: 1,
    quiz_id: 1,
    student_id: 1,
    started_at: '2025-01-01T10:00:00.000Z',
    completed_at: '2025-01-01T10:30:00.000Z',
    score: 80,
    percentage: 80,
    is_passed: true,
    time_taken_seconds: 1800,
    status: 'completed',
    status_label: 'مكتمل',
    is_timed_out: false,
    correct_answers_count: 8,
    total_questions: 10,
    student: {
      id: 1,
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
    },
    quiz: {
      id: 1,
      group_id: 1,
      title: 'اختبار الرياضيات',
      duration_minutes: 30,
      total_marks: 100,
      pass_percentage: 60,
      max_attempts: 2,
      shuffle_questions: false,
      shuffle_answers: false,
      show_correct_answers: true,
      show_score_immediately: true,
      is_published: true,
      is_available: true,
      questions_count: 10,
      attempts_count: 1,
      completed_attempts_count: 1,
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
    },
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    quiz_id: 1,
    student_id: 2,
    started_at: '2025-01-01T11:00:00.000Z',
    completed_at: '2025-01-01T11:25:00.000Z',
    score: 50,
    percentage: 50,
    is_passed: false,
    time_taken_seconds: 1500,
    status: 'completed',
    status_label: 'مكتمل',
    is_timed_out: false,
    correct_answers_count: 5,
    total_questions: 10,
    student: {
      id: 2,
      name: 'سارة أحمد',
      email: 'sara@example.com',
    },
    quiz: {
      id: 1,
      group_id: 1,
      title: 'اختبار الرياضيات',
      duration_minutes: 30,
      total_marks: 100,
      pass_percentage: 60,
      max_attempts: 2,
      shuffle_questions: false,
      shuffle_answers: false,
      show_correct_answers: true,
      show_score_immediately: true,
      is_published: true,
      is_available: true,
      questions_count: 10,
      attempts_count: 1,
      completed_attempts_count: 1,
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
    },
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  },
];

describe('AttemptsTable', () => {
  it('renders empty state when no attempts', () => {
    render(<AttemptsTable attempts={[]} quizId={1} />);

    expect(screen.getByText('لا توجد محاولات حتى الآن')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    render(<AttemptsTable attempts={mockAttempts} quizId={1} />);

    expect(screen.getByText('الطالب')).toBeInTheDocument();
    expect(screen.getByText('تاريخ البدء')).toBeInTheDocument();
    expect(screen.getByText('الحالة')).toBeInTheDocument();
    expect(screen.getByText('الدرجة')).toBeInTheDocument();
    expect(screen.getByText('النسبة')).toBeInTheDocument();
    expect(screen.getByText('الوقت')).toBeInTheDocument();
    expect(screen.getByText('النتيجة')).toBeInTheDocument();
  });

  it('displays student names', () => {
    render(<AttemptsTable attempts={mockAttempts} quizId={1} />);

    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
    expect(screen.getByText('سارة أحمد')).toBeInTheDocument();
  });

  it('displays pass/fail status correctly', () => {
    render(<AttemptsTable attempts={mockAttempts} quizId={1} />);

    const passedBadges = screen.getAllByText('ناجح');
    const failedBadges = screen.getAllByText('راسب');

    expect(passedBadges.length).toBe(1);
    expect(failedBadges.length).toBe(1);
  });

  it('displays status labels', () => {
    render(<AttemptsTable attempts={mockAttempts} quizId={1} />);

    const statusLabels = screen.getAllByText('مكتمل');
    expect(statusLabels.length).toBe(2);
  });

  it('displays percentage correctly', () => {
    render(<AttemptsTable attempts={mockAttempts} quizId={1} />);

    expect(screen.getByText('80.0%')).toBeInTheDocument();
    expect(screen.getByText('50.0%')).toBeInTheDocument();
  });

  it('hides student column when showStudent is false', () => {
    render(<AttemptsTable attempts={mockAttempts} quizId={1} showStudent={false} />);

    expect(screen.queryByText('الطالب')).not.toBeInTheDocument();
    expect(screen.queryByText('أحمد محمد')).not.toBeInTheDocument();
  });

  it('renders view links', () => {
    render(<AttemptsTable attempts={mockAttempts} quizId={1} />);

    const viewLinks = screen.getAllByText('عرض');
    expect(viewLinks.length).toBe(2);
  });
});
