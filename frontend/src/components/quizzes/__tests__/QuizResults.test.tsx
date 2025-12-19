import { render, screen } from '@testing-library/react';
import { QuizResults } from '../QuizResults';
import { QuizAttempt } from '@/types/quiz';

const mockAttempt: QuizAttempt = {
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
    questions: [
      {
        id: 1,
        quiz_id: 1,
        question_text: 'ما هو 2 + 2؟',
        question_type: 'multiple_choice',
        question_type_label: 'اختيار من متعدد',
        marks: 10,
        order_index: 1,
        options: [
          { id: 1, question_id: 1, option_text: '3', is_correct: false, order_index: 1 },
          { id: 2, question_id: 1, option_text: '4', is_correct: true, order_index: 2 },
          { id: 3, question_id: 1, option_text: '5', is_correct: false, order_index: 3 },
        ],
        created_at: '2025-01-01T00:00:00.000Z',
        updated_at: '2025-01-01T00:00:00.000Z',
      },
    ],
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  },
  answers: [
    {
      id: 1,
      attempt_id: 1,
      question_id: 1,
      selected_option_id: 2,
      is_correct: true,
      marks_obtained: 10,
      selected_option: { id: 2, question_id: 1, option_text: '4', is_correct: true, order_index: 2 },
      created_at: '2025-01-01T00:00:00.000Z',
      updated_at: '2025-01-01T00:00:00.000Z',
    },
  ],
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
};

describe('QuizResults', () => {
  it('renders result summary', () => {
    render(<QuizResults attempt={mockAttempt} />);

    expect(screen.getByText('نتيجة الاختبار')).toBeInTheDocument();
    expect(screen.getByText('مكتمل')).toBeInTheDocument();
  });

  it('displays score and percentage', () => {
    render(<QuizResults attempt={mockAttempt} />);

    expect(screen.getByText('80.0%')).toBeInTheDocument();
    expect(screen.getByText('النسبة المئوية')).toBeInTheDocument();
  });

  it('displays correct answers count', () => {
    render(<QuizResults attempt={mockAttempt} />);

    expect(screen.getByText('8 / 10')).toBeInTheDocument();
    expect(screen.getByText('إجابات صحيحة')).toBeInTheDocument();
  });

  it('shows passed status when student passed', () => {
    render(<QuizResults attempt={mockAttempt} />);

    expect(screen.getByText('ناجح')).toBeInTheDocument();
    expect(screen.getByText('لقد اجتزت الاختبار بنجاح. أحسنت!')).toBeInTheDocument();
  });

  it('shows failed status when student failed', () => {
    const failedAttempt = {
      ...mockAttempt,
      percentage: 50,
      is_passed: false,
    };

    render(<QuizResults attempt={failedAttempt} />);

    expect(screen.getByText('لم تجتز')).toBeInTheDocument();
  });

  it('displays answer review section', () => {
    render(<QuizResults attempt={mockAttempt} showAnswers={true} />);

    expect(screen.getByText('مراجعة الإجابات')).toBeInTheDocument();
    expect(screen.getByText('ما هو 2 + 2؟')).toBeInTheDocument();
  });

  it('hides answer review when showAnswers is false', () => {
    render(<QuizResults attempt={mockAttempt} showAnswers={false} />);

    expect(screen.queryByText('مراجعة الإجابات')).not.toBeInTheDocument();
  });

  it('displays time taken', () => {
    render(<QuizResults attempt={mockAttempt} />);

    expect(screen.getByText('30:00')).toBeInTheDocument();
    expect(screen.getByText('الوقت المستغرق')).toBeInTheDocument();
  });
});
