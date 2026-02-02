import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithOAuth: jest.fn(),
    },
  },
}));

describe('Header Component - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Logo Display', () => {
    it('should display the LocalDesk logo', () => {
      render(<Header user={null} />);
      
      const logo = screen.getByText('LocalDesk');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveClass('font-bold', 'text-slate-900');
    });
  });

  describe('Guest User State', () => {
    it('should show "Log In" button for guest users', () => {
      render(<Header user={null} />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      expect(loginButton).toBeInTheDocument();
    });

    it('should style login button with Danish Red accent', () => {
      render(<Header user={null} />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      expect(loginButton).toHaveClass('bg-danish-red');
    });

    it('should not show user info when user is null', () => {
      render(<Header user={null} />);
      
      // Avatar should not be present
      const avatars = screen.queryAllByRole('img');
      expect(avatars).toHaveLength(0);
    });
  });

  describe('Authenticated User State', () => {
    const mockUser: User = {
      id: 'user-123',
      email: 'test@example.com',
      created_at: '2024-01-01T00:00:00Z',
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      role: 'authenticated',
    };

    it('should show user info for authenticated users', () => {
      render(<Header user={mockUser} />);
      
      const userEmail = screen.getByText('test@example.com');
      expect(userEmail).toBeInTheDocument();
    });

    it('should display user avatar with initials', () => {
      render(<Header user={mockUser} />);
      
      const avatarFallback = screen.getByText('TE');
      expect(avatarFallback).toBeInTheDocument();
    });

    it('should not show login button when user is authenticated', () => {
      render(<Header user={mockUser} />);
      
      const loginButton = screen.queryByRole('button', { name: /log in/i });
      expect(loginButton).not.toBeInTheDocument();
    });

    it('should generate correct initials from email', () => {
      const userWithDifferentEmail: User = {
        ...mockUser,
        email: 'john.doe@example.com',
      };
      
      render(<Header user={userWithDifferentEmail} />);
      
      const avatarFallback = screen.getByText('JO');
      expect(avatarFallback).toBeInTheDocument();
    });
  });

  describe('Login Button Interaction', () => {
    it('should open auth modal when login button is clicked', async () => {
      render(<Header user={null} />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      
      // Modal should not be visible initially
      expect(screen.queryByText(/sign in to access your saved chats/i)).not.toBeInTheDocument();
      
      fireEvent.click(loginButton);

      // Modal should be visible after clicking login
      await waitFor(() => {
        expect(screen.getByText(/sign in to access your saved chats/i)).toBeInTheDocument();
      });
    });

    it('should close auth modal when close button is clicked', async () => {
      render(<Header user={null} />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(loginButton);

      // Wait for modal to open
      await waitFor(() => {
        expect(screen.getByText(/sign in to access your saved chats/i)).toBeInTheDocument();
      });

      // Click close button
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByText(/sign in to access your saved chats/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should hide email on small screens', () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        role: 'authenticated',
      };

      render(<Header user={mockUser} />);
      
      const userEmail = screen.getByText('test@example.com');
      expect(userEmail).toHaveClass('hidden', 'sm:inline');
    });
  });

  describe('Header Layout', () => {
    it('should have proper container structure', () => {
      const { container } = render(<Header user={null} />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('w-full', 'border-b', 'border-slate-200', 'bg-white');
    });

    it('should use flexbox for layout', () => {
      const { container } = render(<Header user={null} />);
      
      const innerContainer = container.querySelector('.container');
      expect(innerContainer).toHaveClass('flex', 'items-center', 'justify-between');
    });
  });
});
