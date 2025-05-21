import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmailLoginForm } from './EmailLoginForm';
import { Toaster } from './ui/toaster';

describe('EmailLoginForm', () => {
  const mockOnLogin = vi.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  it('renders email input and login button', () => {
    render(
      <>
        <EmailLoginForm onLogin={mockOnLogin} />
        <Toaster />
      </>
    );

    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('validates email input', async () => {
    render(
      <>
        <EmailLoginForm onLogin={mockOnLogin} />
        <Toaster />
      </>
    );

    const emailInput = screen.getByTestId('email-input');
    const loginButton = screen.getByTestId('login-button');

    // Invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(loginButton).toBeDisabled();

    // Valid email
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    expect(loginButton).not.toBeDisabled();
  });

  it('calls onLogin with email when form is submitted', async () => {
    mockOnLogin.mockResolvedValue(undefined);

    render(
      <>
        <EmailLoginForm onLogin={mockOnLogin} />
        <Toaster />
      </>
    );

    const emailInput = screen.getByTestId('email-input');
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('handles login failure', async () => {
    mockOnLogin.mockRejectedValue(new Error('Login failed'));

    render(
      <>
        <EmailLoginForm onLogin={mockOnLogin} />
        <Toaster />
      </>
    );

    const emailInput = screen.getByTestId('email-input');
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });
});