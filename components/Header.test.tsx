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

// Mock next-intl with actual translation values
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'nav.services': 'Services',
      'nav.knowledge': 'Knowledge',
      'nav.guidance': 'Guidance',
      'auth.signIn': 'Sign In',
      'auth.signOut': 'Sign Out',
      'auth.memberAccess': 'Member Login',
      'auth.access': 'Login',
      'auth.verifiedUser': 'Verified User',
    };
    return translations[key] || key;
  },
  useLocale: () => 'en',
}));

// Mock LanguageSwitcher component
jest.mock('@/components/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher">Language Switcher</div>,
}));

// Mock Logo component
jest.mock('@/components/Logo', () => ({
  Logo: () => <div data-testid="logo">LocalDesk</div>,
}));

// Mock ThemeToggle component
jest.mock('@/components/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

// Mock AuthProvider
jest.mock('@/components/AuthProvider', () => ({
  useAuth: () => ({
    signOut: jest.fn(),
    userSettings: null,
  }),
}));

describe('Header Component - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Logo Display', () => {
    it('should display the LocalDesk logo', () => {
      render(<Header />);

      const logo = screen.getByTestId('logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveTextContent('LocalDesk');
    });
  });

  describe('Guest User State', () => {
    it('should show "Member Login" button for guest users', () => {
      render(<Header />);

      const loginButton = screen.getByRole('button', { name: /log in/i });
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveTextContent('Member Login');
    });

    it('should style login button with foreground/background colors', () => {
      render(<Header />);

      const loginButton = screen.getByRole('button', { name: /log in/i });
      expect(loginButton).toHaveClass('bg-foreground', 'text-background');
    });

    it('should not show user info when user is null', () => {
      render(<Header />);

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
      render(<Header />);

      // Check for display name (derived from email)
      const displayName = screen.getByText('test');
      expect(displayName).toBeInTheDocument();
    });

    it('should display verified user badge', () => {
      render(<Header />);

      const verifiedBadge = screen.getByText('Verified User');
      expect(verifiedBadge).toBeInTheDocument();
    });

    it('should show Sign Out button when user is authenticated', () => {
      render(<Header />);

      const exitButtons = screen.getAllByText('Sign Out');
      expect(exitButtons.length).toBeGreaterThan(0);
    });

    it('should not show Member Login button when user is authenticated', () => {
      render(<Header />);

      const loginButton = screen.queryByText('Member Login');
      expect(loginButton).not.toBeInTheDocument();
    });
  });

  describe('Login Button Interaction', () => {
    it('should open auth modal when login button is clicked', async () => {
      render(<Header />);

      const loginButton = screen.getByRole('button', { name: /log in/i });

      // Modal should not be visible initially
      expect(screen.queryByText(/Enter your credentials to access your personal dashboard/i)).not.toBeInTheDocument();

      fireEvent.click(loginButton);

      // Modal should be visible after clicking login
      await waitFor(() => {
        expect(screen.getByText(/Enter your credentials to access your personal dashboard/i)).toBeInTheDocument();
      });
    });

    it('should close auth modal when close button is clicked', async () => {
      render(<Header />);

      const loginButton = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(loginButton);

      // Wait for modal to open
      await waitFor(() => {
        expect(screen.getByText(/Enter your credentials to access your personal dashboard/i)).toBeInTheDocument();
      });

      // Click close button
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.queryByText(/Enter your credentials to access your personal dashboard/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should show navigation links on desktop', () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2024-01-01T00:00:00Z',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        role: 'authenticated',
      };

      render(<Header />);

      const servicesLink = screen.getByText('Services');
      expect(servicesLink).toBeInTheDocument();

      const knowledgeLink = screen.getByText('Knowledge');
      expect(knowledgeLink).toBeInTheDocument();

      const guidanceLink = screen.getByText('Guidance');
      expect(guidanceLink).toBeInTheDocument();
    });
  });

  describe('Header Layout', () => {
    it('should have proper container structure', () => {
      const { container } = render(<Header />);

      const header = container.querySelector('header');
      expect(header).toHaveClass('w-full', 'sticky', 'top-0');
    });

    it('should use flexbox for layout', () => {
      const { container } = render(<Header />);

      const innerContainer = container.querySelector('.max-w-7xl');
      expect(innerContainer).toHaveClass('flex', 'items-center', 'justify-between');
    });
  });
});
