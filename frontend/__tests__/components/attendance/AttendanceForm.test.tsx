import { render, screen, fireEvent } from '@testing-library/react';
import { AttendanceForm } from '@/components/attendance/AttendanceForm';
import { SessionAttendanceData } from '@/types/attendance';

const mockAttendances: SessionAttendanceData[] = [
  {
    student_id: 1,
    student_name: 'أحمد محمد',
    student_phone: '+201234567890',
    status: 'absent',
    notes: null,
  },
  {
    student_id: 2,
    student_name: 'سارة علي',
    student_phone: '+201234567891',
    status: 'absent',
    notes: null,
  },
];

describe('AttendanceForm', () => {
  it('renders student names', () => {
    render(<AttendanceForm attendances={mockAttendances} onSubmit={jest.fn()} />);

    expect(screen.getByText('أحمد محمد')).toBeInTheDocument();
    expect(screen.getByText('سارة علي')).toBeInTheDocument();
  });

  it('renders student phone numbers', () => {
    render(<AttendanceForm attendances={mockAttendances} onSubmit={jest.fn()} />);

    expect(screen.getByText('+201234567890')).toBeInTheDocument();
    expect(screen.getByText('+201234567891')).toBeInTheDocument();
  });

  it('renders status buttons for each student', () => {
    render(<AttendanceForm attendances={mockAttendances} onSubmit={jest.fn()} />);

    // Each student should have 4 status buttons (present, absent, late, excused)
    const presentButtons = screen.getAllByTitle('حاضر');
    const absentButtons = screen.getAllByTitle('غائب');
    const lateButtons = screen.getAllByTitle('متأخر');
    const excusedButtons = screen.getAllByTitle('معذور');

    expect(presentButtons).toHaveLength(2);
    expect(absentButtons).toHaveLength(2);
    expect(lateButtons).toHaveLength(2);
    expect(excusedButtons).toHaveLength(2);
  });

  it('renders notes input for each student', () => {
    render(<AttendanceForm attendances={mockAttendances} onSubmit={jest.fn()} />);

    const notesInputs = screen.getAllByPlaceholderText('ملاحظات...');
    expect(notesInputs).toHaveLength(2);
  });

  it('renders submit button', () => {
    render(<AttendanceForm attendances={mockAttendances} onSubmit={jest.fn()} />);

    expect(screen.getByText('حفظ الحضور')).toBeInTheDocument();
  });

  it('shows loading state when submitting', () => {
    render(
      <AttendanceForm
        attendances={mockAttendances}
        onSubmit={jest.fn()}
        isSubmitting={true}
      />
    );

    expect(screen.getByText('جاري الحفظ...')).toBeInTheDocument();
  });

  it('calls onSubmit with attendance data when form is submitted', () => {
    const handleSubmit = jest.fn();
    render(<AttendanceForm attendances={mockAttendances} onSubmit={handleSubmit} />);

    // Click present button for first student
    const presentButtons = screen.getAllByTitle('حاضر');
    fireEvent.click(presentButtons[0]);

    // Click submit
    fireEvent.click(screen.getByText('حفظ الحضور'));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ student_id: 1, status: 'present' }),
        expect.objectContaining({ student_id: 2, status: 'absent' }),
      ])
    );
  });

  it('updates notes when typing', () => {
    render(<AttendanceForm attendances={mockAttendances} onSubmit={jest.fn()} />);

    const notesInputs = screen.getAllByPlaceholderText('ملاحظات...');
    fireEvent.change(notesInputs[0], { target: { value: 'ملاحظة تجريبية' } });

    expect(notesInputs[0]).toHaveValue('ملاحظة تجريبية');
  });

  it('disables submit button when isSubmitting', () => {
    render(
      <AttendanceForm
        attendances={mockAttendances}
        onSubmit={jest.fn()}
        isSubmitting={true}
      />
    );

    const submitButton = screen.getByText('جاري الحفظ...');
    expect(submitButton).toBeDisabled();
  });

  it('renders table headers', () => {
    render(<AttendanceForm attendances={mockAttendances} onSubmit={jest.fn()} />);

    expect(screen.getByText('الطالب')).toBeInTheDocument();
    expect(screen.getByText('الحالة')).toBeInTheDocument();
    expect(screen.getByText('ملاحظات')).toBeInTheDocument();
  });
});
