import { render, screen, fireEvent } from '@testing-library/react';
import { Alert } from '@/components/ui/Alert';

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Test message</Alert>);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Alert title="Alert Title">Test message</Alert>);
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders success variant', () => {
    render(<Alert variant="success">Success message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-green-50');
  });

  it('renders error variant', () => {
    render(<Alert variant="error">Error message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-50');
  });

  it('renders warning variant', () => {
    render(<Alert variant="warning">Warning message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-yellow-50');
  });

  it('renders info variant by default', () => {
    render(<Alert>Info message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-blue-50');
  });

  it('shows close button when onClose is provided', () => {
    const handleClose = jest.fn();
    render(<Alert onClose={handleClose}>Test message</Alert>);
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('hides close button when onClose is not provided', () => {
    render(<Alert>Test message</Alert>);
    expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Alert onClose={handleClose}>Test message</Alert>);
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Alert className="custom-class">Test message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });
});
