import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroupsTable } from '@/components/groups/GroupsTable';
import { Group } from '@/types/group';

const mockGroups: Group[] = [
  {
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
  },
  {
    id: 2,
    name: 'الفيزياء للصف الثاني',
    description: null,
    subject: 'الفيزياء',
    grade_level: 'الصف الثاني الثانوي',
    max_students: 25,
    monthly_fee: 350,
    schedule_description: null,
    is_active: false,
    student_count: 0,
    available_spots: 25,
    created_at: '2024-01-02T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z',
  },
];

describe('GroupsTable', () => {
  it('renders empty state when no groups', () => {
    render(<GroupsTable groups={[]} />);

    expect(screen.getByText('لا توجد مجموعات')).toBeInTheDocument();
    expect(screen.getByText('ابدأ بإنشاء مجموعة جديدة')).toBeInTheDocument();
  });

  it('renders groups table with data', () => {
    render(<GroupsTable groups={mockGroups} />);

    expect(screen.getByText('الرياضيات للصف الأول')).toBeInTheDocument();
    expect(screen.getByText('الفيزياء للصف الثاني')).toBeInTheDocument();
  });

  it('displays group subjects', () => {
    render(<GroupsTable groups={mockGroups} />);

    expect(screen.getByText('الرياضيات')).toBeInTheDocument();
    expect(screen.getByText('الفيزياء')).toBeInTheDocument();
  });

  it('displays student counts', () => {
    render(<GroupsTable groups={mockGroups} />);

    expect(screen.getByText(/15 \/ 20/)).toBeInTheDocument();
    expect(screen.getByText(/0 \/ 25/)).toBeInTheDocument();
  });

  it('displays active status badges', () => {
    render(<GroupsTable groups={mockGroups} />);

    expect(screen.getByText('نشطة')).toBeInTheDocument();
    expect(screen.getByText('غير نشطة')).toBeInTheDocument();
  });

  it('shows full badge when group is at capacity', () => {
    const fullGroup: Group = {
      ...mockGroups[0],
      student_count: 20,
      available_spots: 0,
    };
    render(<GroupsTable groups={[fullGroup]} />);

    expect(screen.getByText('مكتملة')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(<GroupsTable groups={mockGroups} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByTitle('حذف');
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith(mockGroups[0]);
  });

  it('disables delete button when isDeleting is true', () => {
    render(<GroupsTable groups={mockGroups} onDelete={() => {}} isDeleting={true} />);

    const deleteButtons = screen.getAllByTitle('حذف');
    deleteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('renders view and edit links', () => {
    render(<GroupsTable groups={mockGroups} />);

    const viewLinks = screen.getAllByTitle('عرض');
    const editLinks = screen.getAllByTitle('تعديل');

    expect(viewLinks).toHaveLength(2);
    expect(editLinks).toHaveLength(2);
  });
});
