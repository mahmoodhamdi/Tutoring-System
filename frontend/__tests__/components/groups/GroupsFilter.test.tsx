import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GroupsFilter } from '@/components/groups/GroupsFilter';

describe('GroupsFilter', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders search input', () => {
    render(<GroupsFilter filters={{}} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByPlaceholderText('البحث في المجموعات...')).toBeInTheDocument();
  });

  it('renders filter button', () => {
    render(<GroupsFilter filters={{}} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByRole('button', { name: /تصفية/ })).toBeInTheDocument();
  });

  it('shows filter panel when filter button is clicked', async () => {
    const user = userEvent.setup();
    render(<GroupsFilter filters={{}} onFilterChange={mockOnFilterChange} />);

    await user.click(screen.getByRole('button', { name: /تصفية/ }));

    expect(screen.getByLabelText('المادة')).toBeInTheDocument();
    expect(screen.getByLabelText('المرحلة الدراسية')).toBeInTheDocument();
    expect(screen.getByLabelText('الحالة')).toBeInTheDocument();
  });

  it('calls onFilterChange when subject filter changes', async () => {
    const user = userEvent.setup();
    render(<GroupsFilter filters={{}} onFilterChange={mockOnFilterChange} />);

    await user.click(screen.getByRole('button', { name: /تصفية/ }));
    await user.selectOptions(screen.getByLabelText('المادة'), 'الرياضيات');

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'الرياضيات' })
    );
  });

  it('calls onFilterChange when status filter changes', async () => {
    const user = userEvent.setup();
    render(<GroupsFilter filters={{}} onFilterChange={mockOnFilterChange} />);

    await user.click(screen.getByRole('button', { name: /تصفية/ }));
    await user.selectOptions(screen.getByLabelText('الحالة'), 'true');

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ is_active: true })
    );
  });

  it('shows clear filters button when filters are active', async () => {
    const user = userEvent.setup();
    render(
      <GroupsFilter filters={{ subject: 'الرياضيات' }} onFilterChange={mockOnFilterChange} />
    );

    await user.click(screen.getByRole('button', { name: /تصفية/ }));

    expect(screen.getByText('مسح التصفية')).toBeInTheDocument();
  });

  it('clears all filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GroupsFilter filters={{ subject: 'الرياضيات' }} onFilterChange={mockOnFilterChange} />
    );

    await user.click(screen.getByRole('button', { name: /تصفية/ }));
    await user.click(screen.getByText('مسح التصفية'));

    expect(mockOnFilterChange).toHaveBeenCalledWith({ page: 1 });
  });

  it('displays current search value', () => {
    render(
      <GroupsFilter filters={{ search: 'رياضيات' }} onFilterChange={mockOnFilterChange} />
    );

    expect(screen.getByDisplayValue('رياضيات')).toBeInTheDocument();
  });
});
