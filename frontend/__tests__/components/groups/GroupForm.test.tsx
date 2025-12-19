import { render, screen } from '@testing-library/react';
import { GroupForm } from '@/components/groups/GroupForm';
import { Group } from '@/types/group';

const mockGroup: Group = {
  id: 1,
  name: 'الرياضيات للصف الأول',
  description: 'مجموعة رياضيات',
  subject: 'الرياضيات',
  grade_level: 'الصف الأول الثانوي',
  max_students: 20,
  monthly_fee: 300,
  schedule_description: 'أحد وأربعاء',
  is_active: true,
  student_count: 15,
  available_spots: 5,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

describe('GroupForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form fields', () => {
    render(<GroupForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/اسم المجموعة/)).toBeInTheDocument();
    expect(screen.getByLabelText(/الوصف/)).toBeInTheDocument();
    expect(screen.getByLabelText(/المادة/)).toBeInTheDocument();
    expect(screen.getByLabelText(/المرحلة الدراسية/)).toBeInTheDocument();
    expect(screen.getByLabelText(/الحد الأقصى للطلاب/)).toBeInTheDocument();
    expect(screen.getByLabelText(/الرسوم الشهرية/)).toBeInTheDocument();
    expect(screen.getByLabelText(/وصف الجدول/)).toBeInTheDocument();
    expect(screen.getByLabelText(/الحالة/)).toBeInTheDocument();
  });

  it('renders create button when no group provided', () => {
    render(<GroupForm onSubmit={mockOnSubmit} />);

    expect(screen.getByRole('button', { name: /إنشاء/ })).toBeInTheDocument();
  });

  it('renders update button when group provided', () => {
    render(<GroupForm group={mockGroup} onSubmit={mockOnSubmit} />);

    expect(screen.getByRole('button', { name: /تحديث/ })).toBeInTheDocument();
  });

  it('populates form with group data when editing', () => {
    render(<GroupForm group={mockGroup} onSubmit={mockOnSubmit} />);

    expect(screen.getByDisplayValue('الرياضيات للصف الأول')).toBeInTheDocument();
    expect(screen.getByDisplayValue('مجموعة رياضيات')).toBeInTheDocument();
    expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    expect(screen.getByDisplayValue('300')).toBeInTheDocument();
    expect(screen.getByDisplayValue('أحد وأربعاء')).toBeInTheDocument();
  });

  it('renders subject options', () => {
    render(<GroupForm onSubmit={mockOnSubmit} />);

    const subjectSelect = screen.getByLabelText(/المادة/);
    expect(subjectSelect).toContainElement(screen.getByText('الرياضيات'));
    expect(subjectSelect).toContainElement(screen.getByText('اللغة العربية'));
    expect(subjectSelect).toContainElement(screen.getByText('الفيزياء'));
  });

  it('renders grade level options', () => {
    render(<GroupForm onSubmit={mockOnSubmit} />);

    const gradeSelect = screen.getByLabelText(/المرحلة الدراسية/);
    expect(gradeSelect).toContainElement(screen.getByText('الصف الأول الثانوي'));
    expect(gradeSelect).toContainElement(screen.getByText('الصف الثاني الثانوي'));
  });

  it('shows loading state when submitting', () => {
    render(<GroupForm onSubmit={mockOnSubmit} isSubmitting={true} />);

    expect(screen.getByRole('button', { name: /جاري الحفظ/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /جاري الحفظ/ })).toBeDisabled();
  });

  it('renders cancel button', () => {
    render(<GroupForm onSubmit={mockOnSubmit} />);

    expect(screen.getByRole('button', { name: /إلغاء/ })).toBeInTheDocument();
  });
});
