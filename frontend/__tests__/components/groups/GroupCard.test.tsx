import { render, screen } from '@testing-library/react';
import { GroupCard } from '@/components/groups/GroupCard';
import { Group } from '@/types/group';

const mockGroup: Group = {
  id: 1,
  name: 'الرياضيات للصف الأول',
  description: 'مجموعة لتعليم الرياضيات',
  subject: 'الرياضيات',
  grade_level: 'الصف الأول الثانوي',
  max_students: 20,
  monthly_fee: 300,
  schedule_description: 'كل أحد وأربعاء من 4 إلى 6',
  is_active: true,
  student_count: 15,
  available_spots: 5,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

describe('GroupCard', () => {
  it('renders group name', () => {
    render(<GroupCard group={mockGroup} />);

    expect(screen.getByText('الرياضيات للصف الأول')).toBeInTheDocument();
  });

  it('renders group description', () => {
    render(<GroupCard group={mockGroup} />);

    expect(screen.getByText('مجموعة لتعليم الرياضيات')).toBeInTheDocument();
  });

  it('renders active status badge', () => {
    render(<GroupCard group={mockGroup} />);

    expect(screen.getByText('نشطة')).toBeInTheDocument();
  });

  it('renders inactive status badge', () => {
    const inactiveGroup = { ...mockGroup, is_active: false };
    render(<GroupCard group={inactiveGroup} />);

    expect(screen.getByText('غير نشطة')).toBeInTheDocument();
  });

  it('renders subject', () => {
    render(<GroupCard group={mockGroup} />);

    expect(screen.getByText('الرياضيات')).toBeInTheDocument();
  });

  it('renders grade level', () => {
    render(<GroupCard group={mockGroup} />);

    expect(screen.getByText('الصف الأول الثانوي')).toBeInTheDocument();
  });

  it('renders student count', () => {
    render(<GroupCard group={mockGroup} />);

    expect(screen.getByText(/15 \/ 20 طالب/)).toBeInTheDocument();
  });

  it('renders monthly fee', () => {
    render(<GroupCard group={mockGroup} />);

    expect(screen.getByText(/ج\.م \/ شهر/)).toBeInTheDocument();
  });

  it('renders available spots', () => {
    render(<GroupCard group={mockGroup} />);

    expect(screen.getByText('5 مكان متاح')).toBeInTheDocument();
  });

  it('renders schedule description', () => {
    render(<GroupCard group={mockGroup} />);

    expect(screen.getByText(/كل أحد وأربعاء من 4 إلى 6/)).toBeInTheDocument();
  });

  it('is a link to group detail page', () => {
    render(<GroupCard group={mockGroup} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard/groups/1');
  });
});
