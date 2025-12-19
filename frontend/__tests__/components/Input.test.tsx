import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input label="Email" name="email" error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('displays helper text', () => {
    render(<Input label="Email" name="email" helperText="Enter your email" />);
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(
      <Input
        label="Email"
        name="email"
        error="Email is required"
        helperText="Enter your email"
      />
    );
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
  });

  it('applies error styles when error is present', () => {
    render(<Input label="Email" name="email" error="Error" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('border-red-500');
  });

  it('applies custom className', () => {
    render(<Input label="Email" name="email" className="custom-class" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveClass('custom-class');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input label="Email" name="email" disabled />);
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input label="Email" name="email" error="Error" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders correct input type', () => {
    render(<Input label="Password" name="password" type="password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });
});
