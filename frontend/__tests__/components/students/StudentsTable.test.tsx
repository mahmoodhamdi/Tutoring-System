import { render, screen, fireEvent } from '@testing-library/react';
import { StudentsTable } from '@/components/students/StudentsTable';
import { Student } from '@/types/student';

const mockStudents: Student[] = [
  {
    id: 1,
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+201234567890',
    role: 'student',
    date_of_birth: '2010-05-15',
    gender: 'male',
    avatar: null,
    is_active: true,
    email_verified_at: null,
    phone_verified_at: null,
    profile: {
      id: 1,
      grade_level: 'الصف الأول',
      school_name: 'مدرسة النجاح',
      address: 'القاهرة',
      emergency_contact_name: 'والد أحمد',
      emergency_contact_phone: '+201111111111',
      notes: null,
      enrollment_date: '2024-09-01',
      status: 'active',
      parent: null,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    },
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'سارة علي',
    email: 'sara@example.com',
    phone: '+201234567891',
    role: 'student',
    date_of_birth: '2011-03-20',
    gender: 'female',
    avatar: null,
    is_active: true,
    email_verified_at: null,
    phone_verified_at: null,
    profile: {
      id: 2,
      grade_level: 'الصف الثاني',
      school_name: 'مدرسة المستقبل',
      address: 'الإسكندرية',
      emergency_contact_name: null,
      emergency_contact_phone: null,
      notes: null,
      enrollment_date: '2024-09-01',
      status: 'inactive',
      parent: null,
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    },
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
];

describe('StudentsTable', () => {
  it('renders students correctly', () => {
    render(<StudentsTable students={mockStudents} />);

    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
    expect(screen.getByText('سارة علي')).toBeInTheDocument();
    expect(screen.getByText('+201234567890')).toBeInTheDocument();
    expect(screen.getByText('+201234567891')).toBeInTheDocument();
  });

  it('renders grade levels', () => {
    render(<StudentsTable students={mockStudents} />);

    expect(screen.getByText('الصف الأول')).toBeInTheDocument();
    expect(screen.getByText('الصف الثاني')).toBeInTheDocument();
  });

  it('renders status badges', () => {
    render(<StudentsTable students={mockStudents} />);

    expect(screen.getByText('نشط')).toBeInTheDocument();
    expect(screen.getByText('غير نشط')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<StudentsTable students={[]} isLoading={true} />);

    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('shows empty state when no students', () => {
    render(<StudentsTable students={[]} />);

    expect(screen.getByText('لا يوجد طلاب')).toBeInTheDocument();
    expect(screen.getByText('ابدأ بإضافة طالب جديد للنظام')).toBeInTheDocument();
  });

  it('calls onDelete when delete is confirmed', () => {
    const handleDelete = jest.fn();
    render(<StudentsTable students={mockStudents} onDelete={handleDelete} />);

    // Click delete button
    const deleteButtons = screen.getAllByText('حذف');
    fireEvent.click(deleteButtons[0]);

    // Click confirm
    fireEvent.click(screen.getByText('تأكيد'));

    expect(handleDelete).toHaveBeenCalledWith(1);
  });

  it('cancels delete when cancel is clicked', () => {
    const handleDelete = jest.fn();
    render(<StudentsTable students={mockStudents} onDelete={handleDelete} />);

    // Click delete button
    const deleteButtons = screen.getAllByText('حذف');
    fireEvent.click(deleteButtons[0]);

    // Click cancel
    fireEvent.click(screen.getByText('إلغاء'));

    expect(handleDelete).not.toHaveBeenCalled();
  });

  it('calls onSort when column header is clicked', () => {
    const handleSort = jest.fn();
    render(<StudentsTable students={mockStudents} onSort={handleSort} />);

    fireEvent.click(screen.getByText('الاسم'));

    expect(handleSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('toggles sort order when same column is clicked again', () => {
    const handleSort = jest.fn();
    render(
      <StudentsTable
        students={mockStudents}
        onSort={handleSort}
        sortBy="name"
        sortOrder="asc"
      />
    );

    fireEvent.click(screen.getByText('الاسم'));

    expect(handleSort).toHaveBeenCalledWith('name', 'desc');
  });

  it('renders view and edit links', () => {
    render(<StudentsTable students={mockStudents} />);

    const viewLinks = screen.getAllByText('عرض');
    const editLinks = screen.getAllByText('تعديل');

    expect(viewLinks).toHaveLength(2);
    expect(editLinks).toHaveLength(2);
  });
});
