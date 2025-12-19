import { render, screen, fireEvent } from '@testing-library/react';
import { StudentCard } from '@/components/students/StudentCard';
import { Student } from '@/types/student';

const mockStudent: Student = {
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
    parent: {
      id: 10,
      name: 'محمد أحمد',
      email: 'parent@example.com',
      phone: '+201999999999',
    },
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

describe('StudentCard', () => {
  it('renders student name', () => {
    render(<StudentCard student={mockStudent} />);
    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
  });

  it('renders student phone', () => {
    render(<StudentCard student={mockStudent} />);
    expect(screen.getByText('+201234567890')).toBeInTheDocument();
  });

  it('renders student email', () => {
    render(<StudentCard student={mockStudent} />);
    expect(screen.getByText('ahmed@example.com')).toBeInTheDocument();
  });

  it('renders grade level', () => {
    render(<StudentCard student={mockStudent} />);
    expect(screen.getByText('الصف الأول')).toBeInTheDocument();
  });

  it('renders school name', () => {
    render(<StudentCard student={mockStudent} />);
    expect(screen.getByText('مدرسة النجاح')).toBeInTheDocument();
  });

  it('renders status badge', () => {
    render(<StudentCard student={mockStudent} />);
    expect(screen.getByText('نشط')).toBeInTheDocument();
  });

  it('renders gender', () => {
    render(<StudentCard student={mockStudent} />);
    expect(screen.getByText('ذكر')).toBeInTheDocument();
  });

  it('renders parent info', () => {
    render(<StudentCard student={mockStudent} />);
    expect(screen.getByText('محمد أحمد')).toBeInTheDocument();
    expect(screen.getByText('+201999999999')).toBeInTheDocument();
  });

  it('renders view details link', () => {
    render(<StudentCard student={mockStudent} />);
    expect(screen.getByText('عرض التفاصيل')).toBeInTheDocument();
  });

  it('renders edit link', () => {
    render(<StudentCard student={mockStudent} />);
    expect(screen.getByRole('link', { name: 'تعديل' })).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = jest.fn();
    render(<StudentCard student={mockStudent} onDelete={handleDelete} />);

    fireEvent.click(screen.getByText('حذف'));
    expect(handleDelete).toHaveBeenCalledWith(1);
  });

  it('does not render delete button when onDelete is not provided', () => {
    render(<StudentCard student={mockStudent} />);
    expect(screen.queryByText('حذف')).not.toBeInTheDocument();
  });

  it('renders inactive status correctly', () => {
    const inactiveStudent = {
      ...mockStudent,
      profile: { ...mockStudent.profile!, status: 'inactive' as const },
    };
    render(<StudentCard student={inactiveStudent} />);
    expect(screen.getByText('غير نشط')).toBeInTheDocument();
  });

  it('renders suspended status correctly', () => {
    const suspendedStudent = {
      ...mockStudent,
      profile: { ...mockStudent.profile!, status: 'suspended' as const },
    };
    render(<StudentCard student={suspendedStudent} />);
    expect(screen.getByText('معلق')).toBeInTheDocument();
  });

  it('renders female gender correctly', () => {
    const femaleStudent = { ...mockStudent, gender: 'female' as const };
    render(<StudentCard student={femaleStudent} />);
    expect(screen.getByText('أنثى')).toBeInTheDocument();
  });

  it('renders avatar initial when no avatar', () => {
    render(<StudentCard student={mockStudent} />);
    const avatar = screen.getByText('أ');
    expect(avatar).toBeInTheDocument();
  });
});
