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
    expect(alert.className).toMatch(/success/);
  });

  it('renders error variant', () => {
    render(<Alert variant="error">Error message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert.className).toMatch(/error/);
  });

  it('renders warning variant', () => {
    render(<Alert variant="warning">Warning message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert.className).toMatch(/warning/);
  });

  it('renders info variant by default', () => {
    render(<Alert>Info message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert.className).toMatch(/info/);
  });

  it('shows close button when onClose is provided', () => {
    const handleClose = jest.fn();
    render(<Alert onClose={handleClose}>Test message</Alert>);
    expect(screen.getByRole('button', { name: /إغلاق/i })).toBeInTheDocument();
  });

  it('hides close button when onClose is not provided', () => {
    render(<Alert>Test message</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<Alert onClose={handleClose}>Test message</Alert>);
    fireEvent.click(screen.getByRole('button', { name: /إغلاق/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Alert className="custom-class">Test message</Alert>);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('custom-class');
  });
});
