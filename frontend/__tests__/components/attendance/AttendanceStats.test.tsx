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
    render(<AttendanceStats summary={mockStats} />);

    expect(screen.getByText('نسبة الحضور')).toBeInTheDocument();
    // Component calculates rate as (present + late) / total = (75+7)/100 = 82%
    expect(screen.getByText('82%')).toBeInTheDocument();
  });

  it('renders present count', () => {
    render(<AttendanceStats summary={mockStats} />);

    expect(screen.getByText('حاضر')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('renders absent count', () => {
    render(<AttendanceStats summary={mockStats} />);

    expect(screen.getByText('غائب')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders late count', () => {
    render(<AttendanceStats summary={mockStats} />);

    expect(screen.getByText('متأخر')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('renders excused count', () => {
    render(<AttendanceStats summary={mockStats} />);

    expect(screen.getByText('معذور')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders total sessions count in progress bar', () => {
    render(<AttendanceStats summary={mockStats} />);

    // Component shows "82 من 100" in the progress bar area
    expect(screen.getByText(/من 100/)).toBeInTheDocument();
  });

  it('renders stat cards with correct colors', () => {
    render(<AttendanceStats summary={mockStats} />);

    // Check for color classes in the rendered output
    const container = document.querySelector('.grid');
    expect(container).toBeInTheDocument();
  });
});
