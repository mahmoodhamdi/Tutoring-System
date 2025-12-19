import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroupStudentsList } from '@/components/groups/GroupStudentsList';
import { GroupStudent } from '@/types/group';

const mockStudents: GroupStudent[] = [
  {
    id: 1,
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '01012345678',
    role: 'student',
    profile: null,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    pivot: {
      joined_at: '2024-01-15',
      left_at: null,
      is_active: true,
      notes: null,
    },
  },
  {
    id: 2,
    name: 'سارة أحمد',
    email: 'sara@example.com',
    phone: '01098765432',
    role: 'student',
    profile: null,
    created_at: '2024-01-02T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z',
    pivot: {
      joined_at: '2024-02-01',
      left_at: '2024-03-01',
      is_active: false,
      notes: null,
    },
  },
];

describe('GroupStudentsList', () => {
  it('renders empty state when no students', () => {
    render(<GroupStudentsList students={[]} />);

    expect(screen.getByText('لا يوجد طلاب')).toBeInTheDocument();
  });

  it('renders student names', () => {
    render(<GroupStudentsList students={mockStudents} />);

    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
    expect(screen.getByText('سارة أحمد')).toBeInTheDocument();
  });

  it('renders student phone numbers', () => {
    render(<GroupStudentsList students={mockStudents} />);

    expect(screen.getByText('01012345678')).toBeInTheDocument();
    expect(screen.getByText('01098765432')).toBeInTheDocument();
  });

  it('shows inactive badge for inactive students', () => {
    render(<GroupStudentsList students={mockStudents} />);

    expect(screen.getByText('غير نشط')).toBeInTheDocument();
  });

  it('shows remove button for active students when onRemove provided', () => {
    const onRemove = jest.fn();
    render(<GroupStudentsList students={mockStudents} onRemove={onRemove} />);

    const removeButtons = screen.getAllByTitle('إزالة من المجموعة');
    expect(removeButtons).toHaveLength(1);
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    render(<GroupStudentsList students={mockStudents} onRemove={onRemove} />);

    await user.click(screen.getByTitle('إزالة من المجموعة'));

    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('disables remove button when isRemoving is true', () => {
    const onRemove = jest.fn();
    render(<GroupStudentsList students={mockStudents} onRemove={onRemove} isRemoving={true} />);

    expect(screen.getByTitle('إزالة من المجموعة')).toBeDisabled();
  });

  it('shows joined date', () => {
    render(<GroupStudentsList students={mockStudents} />);

    expect(screen.getAllByText(/انضم في/).length).toBeGreaterThan(0);
  });

  it('shows left date for inactive students', () => {
    render(<GroupStudentsList students={mockStudents} showInactive={true} />);

    expect(screen.getByText(/غادر في/)).toBeInTheDocument();
  });
});
