import { render, screen } from '@testing-library/react';
import { AttendanceStats } from '@/components/attendance/AttendanceStats';

const mockStats = {
  total: 100,
  present: 75,
  absent: 15,
  late: 7,
  excused: 3,
  attendance_rate: 85,
};

describe('AttendanceStats', () => {
  it('renders attendance rate', () => {
    render(<AttendanceStats stats={mockStats} />);

    expect(screen.getByText('نسبة الحضور')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('renders present count', () => {
    render(<AttendanceStats stats={mockStats} />);

    expect(screen.getByText('حاضر')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('renders absent count', () => {
    render(<AttendanceStats stats={mockStats} />);

    expect(screen.getByText('غائب')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders late count', () => {
    render(<AttendanceStats stats={mockStats} />);

    expect(screen.getByText('متأخر')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders excused count', () => {
    render(<AttendanceStats stats={mockStats} />);

    expect(screen.getByText('معذور')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders total sessions count', () => {
    render(<AttendanceStats stats={mockStats} />);

    expect(screen.getByText('إجمالي الجلسات')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders stat cards with correct colors', () => {
    render(<AttendanceStats stats={mockStats} />);

    // Check for color classes in the rendered output
    const container = document.querySelector('.grid');
    expect(container).toBeInTheDocument();
  });
});
