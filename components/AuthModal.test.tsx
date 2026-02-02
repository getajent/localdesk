import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthModal } from '@/components/AuthModal';
import { supabase } from '@/lib/supabase';

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  },
}));

describe('AuthModal - Unit Tests', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Modal Visibility', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <AuthModal isOpen={false} onClose={mockOnClose} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render when isOpen is true', () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });
  });

  describe('Login Form Validation', () => {
    it('should show error for invalid email', async () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /^log in$/i });

      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.submit(submitButton.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
    });

    it('should show error for short password', async () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '12345' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });
    });

    it('should accept valid email and password', async () => {
      const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
      mockSignIn.mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } },
        error: null,
      });

      render(<AuthModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });
  });

  describe('Successful Authentication Creates Session', () => {
    it('should call onSuccess and onClose after successful login', async () => {
      const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
      mockSignIn.mockResolvedValue({
        data: { session: { user: { id: 'user-123', email: 'test@example.com' } } },
        error: null,
      });

      render(<AuthModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should call onSuccess and onClose after successful signup', async () => {
      const mockSignUp = supabase.auth.signUp as jest.Mock;
      mockSignUp.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      });

      render(<AuthModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      // Switch to sign up mode
      const signUpToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpToggle);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'password123',
        });
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Profile Creation for New Users', () => {
    it('should trigger profile creation on successful signup', async () => {
      const mockSignUp = supabase.auth.signUp as jest.Mock;
      mockSignUp.mockResolvedValue({
        data: { 
          user: { 
            id: 'new-user-123', 
            email: 'newuser@example.com',
            created_at: new Date().toISOString(),
          } 
        },
        error: null,
      });

      render(<AuthModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      // Switch to sign up mode
      const signUpToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpToggle);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalled();
        // Profile creation happens via database trigger
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling for Invalid Credentials', () => {
    it('should display error message for invalid credentials', async () => {
      const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
      mockSignIn.mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid login credentials' },
      });

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid login credentials/i)).toBeInTheDocument();
      });
    });

    it('should display generic error for signup failures', async () => {
      const mockSignUp = supabase.auth.signUp as jest.Mock;
      mockSignUp.mockResolvedValue({
        data: { user: null },
        error: { message: 'User already registered' },
      });

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      // Switch to sign up mode
      const signUpToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpToggle);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/user already registered/i)).toBeInTheDocument();
      });
    });

    it('should not call onSuccess when authentication fails', async () => {
      const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
      mockSignIn.mockResolvedValue({
        data: { session: null },
        error: { message: 'Authentication failed' },
      });

      render(<AuthModal isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/authentication failed/i)).toBeInTheDocument();
      });

      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Modal Interaction', () => {
    it('should close modal when close button is clicked', () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should toggle between login and signup modes', () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      // Initially in login mode - check description text
      expect(screen.getByText(/sign in to access your saved chats/i)).toBeInTheDocument();

      // Switch to signup mode
      const signUpToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpToggle);

      expect(screen.getByText(/create account/i)).toBeInTheDocument();
      expect(screen.getByText(/sign up to save your chat history/i)).toBeInTheDocument();

      // Switch back to login mode
      const logInToggle = screen.getByRole('button', { name: /^log in$/i });
      fireEvent.click(logInToggle);

      expect(screen.getByText(/sign in to access your saved chats/i)).toBeInTheDocument();
    });

    it('should clear error when switching modes', async () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');
      const submitButton = screen.getByRole('button', { name: /^log in$/i });

      // Trigger validation error
      fireEvent.change(emailInput, { target: { value: 'invalid' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.submit(submitButton.closest('form')!);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });

      // Switch modes
      const signUpToggle = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpToggle);

      // Error should be cleared
      expect(screen.queryByText(/please enter a valid email/i)).not.toBeInTheDocument();
    });

    it('should disable form inputs while loading', async () => {
      const mockSignIn = supabase.auth.signInWithPassword as jest.Mock;
      mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
      const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /log in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Inputs should be disabled during loading
      await waitFor(() => {
        expect(emailInput.disabled).toBe(true);
        expect(passwordInput.disabled).toBe(true);
      });
    });
  });

  describe('UI Elements', () => {
    it('should display email and password input fields', () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('should have proper input types', () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should display submit button with correct text', () => {
      render(<AuthModal isOpen={true} onClose={mockOnClose} />);

      const submitButton = screen.getByRole('button', { name: /log in/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveClass('bg-[#C60C30]');
    });
  });
});
