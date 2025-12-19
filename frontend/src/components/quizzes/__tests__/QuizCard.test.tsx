import { render, screen, fireEvent } from '@testing-library/react';
import { QuizCard } from '../QuizCard';
import { Quiz } from '@/types/quiz';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const mockQuiz: Quiz = {
  id: 1,
  group_id: 1,
  title: 'اختبار الرياضيات',
  description: 'اختبار قصير في الجبر',
  instructions: 'أجب عن جميع الأسئلة',
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
  attempts_count: 5,
  completed_attempts_count: 3,
  average_score: 75,
  average_percentage: 75,
  group: {
    id: 1,
    name: 'الصف الأول',
  },
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
};

describe('QuizCard', () => {
  it('renders quiz title and group', () => {
    render(<QuizCard quiz={mockQuiz} />);

    expect(screen.getByText('اختبار الرياضيات')).toBeInTheDocument();
    expect(screen.getByText('الصف الأول')).toBeInTheDocument();
  });

  it('displays quiz statistics', () => {
    render(<QuizCard quiz={mockQuiz} />);

    expect(screen.getByText('10 سؤال')).toBeInTheDocument();
    expect(screen.getByText('30 دقيقة')).toBeInTheDocument();
    expect(screen.getByText('100 درجة')).toBeInTheDocument();
    expect(screen.getByText('3 محاولة')).toBeInTheDocument();
  });

  it('shows published status for published quiz', () => {
    render(<QuizCard quiz={mockQuiz} />);

    expect(screen.getByText('منشور')).toBeInTheDocument();
  });

  it('shows draft status for unpublished quiz', () => {
    const unpublishedQuiz = { ...mockQuiz, is_published: false };
    render(<QuizCard quiz={unpublishedQuiz} />);

    expect(screen.getByText('مسودة')).toBeInTheDocument();
  });

  it('calls onPublish when publish button is clicked', () => {
    const unpublishedQuiz = { ...mockQuiz, is_published: false };
    const handlePublish = jest.fn();

    render(<QuizCard quiz={unpublishedQuiz} onPublish={handlePublish} />);

    fireEvent.click(screen.getByText('نشر'));
    expect(handlePublish).toHaveBeenCalledWith(1);
  });

  it('calls onUnpublish when unpublish button is clicked', () => {
    const handleUnpublish = jest.fn();

    render(<QuizCard quiz={mockQuiz} onUnpublish={handleUnpublish} />);

    fireEvent.click(screen.getByText('إلغاء النشر'));
    expect(handleUnpublish).toHaveBeenCalledWith(1);
  });

  it('calls onDuplicate when duplicate button is clicked', () => {
    const handleDuplicate = jest.fn();

    render(<QuizCard quiz={mockQuiz} onDuplicate={handleDuplicate} />);

    fireEvent.click(screen.getByText('نسخ'));
    expect(handleDuplicate).toHaveBeenCalledWith(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn();

    render(<QuizCard quiz={mockQuiz} onDelete={handleDelete} />);

    fireEvent.click(screen.getByText('حذف'));
    expect(handleDelete).toHaveBeenCalledWith(1);
  });

  it('displays average percentage when available', () => {
    render(<QuizCard quiz={mockQuiz} />);

    expect(screen.getByText('المتوسط: 75%')).toBeInTheDocument();
  });

  it('hides action buttons when isTeacher is false', () => {
    render(<QuizCard quiz={mockQuiz} isTeacher={false} />);

    expect(screen.queryByText('تعديل')).not.toBeInTheDocument();
    expect(screen.queryByText('حذف')).not.toBeInTheDocument();
  });
});
