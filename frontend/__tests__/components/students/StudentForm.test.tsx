import { render, screen } from '@testing-library/react';
import { StudentForm } from '@/components/students/StudentForm';
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
    notes: 'ملاحظات',
    enrollment_date: '2024-09-01',
    status: 'active',
    parent: null,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  },
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

describe('StudentForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockReset();
  });

  it('renders empty form for new student', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('الاسم *')).toHaveValue('');
    expect(screen.getByLabelText('رقم الهاتف *')).toHaveValue('');
    expect(screen.getByLabelText('البريد الإلكتروني')).toHaveValue('');
  });

  it('renders form with student data for editing', () => {
    render(<StudentForm student={mockStudent} onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('الاسم *')).toHaveValue('أحمد محمد');
    expect(screen.getByLabelText('رقم الهاتف *')).toHaveValue('+201234567890');
    expect(screen.getByLabelText('البريد الإلكتروني')).toHaveValue(
      'ahmed@example.com'
    );
  });

  it('renders all form sections', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText('المعلومات الأساسية')).toBeInTheDocument();
    expect(screen.getByText('معلومات الطالب')).toBeInTheDocument();
    expect(screen.getByText('جهة الاتصال الطارئة')).toBeInTheDocument();
    expect(screen.getByText('ملاحظات')).toBeInTheDocument();
  });

  it('renders name input field', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText('الاسم *')).toBeInTheDocument();
  });

  it('renders phone input field', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText('رقم الهاتف *')).toBeInTheDocument();
  });

  it('renders email input field', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText('البريد الإلكتروني')).toBeInTheDocument();
  });

  it('renders password input field for new student', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText('كلمة المرور *')).toBeInTheDocument();
  });

  it('renders password input field with different label when editing', () => {
    render(<StudentForm student={mockStudent} onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText('كلمة المرور الجديدة')).toBeInTheDocument();
  });

  it('renders submit button for new student', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText('إضافة الطالب')).toBeInTheDocument();
  });

  it('renders submit button with different text when editing', () => {
    render(<StudentForm student={mockStudent} onSubmit={mockOnSubmit} />);
    expect(screen.getByText('حفظ التغييرات')).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);
    expect(screen.getByText('إلغاء')).toBeInTheDocument();
  });

  it('shows loading state when submitting', () => {
    render(<StudentForm onSubmit={mockOnSubmit} isLoading={true} />);

    // Find the submit button (may show loading spinner instead of text)
    const buttons = screen.getAllByRole('button');
    const submitButton = buttons.find(
      (btn) => btn.textContent?.includes('إضافة الطالب') || btn.getAttribute('type') === 'submit'
    );
    expect(submitButton).toBeDisabled();
  });

  it('renders notes textarea', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);
    expect(
      screen.getByPlaceholderText(/أضف أي ملاحظات إضافية/i)
    ).toBeInTheDocument();
  });

  it('renders is_active checkbox', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText('الحساب نشط')).toBeInTheDocument();
  });

  it('renders date of birth input', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText('تاريخ الميلاد')).toBeInTheDocument();
  });

  it('renders school name input', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText('المدرسة')).toBeInTheDocument();
  });

  it('renders enrollment date input', () => {
    render(<StudentForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText('تاريخ التسجيل')).toBeInTheDocument();
  });
});
