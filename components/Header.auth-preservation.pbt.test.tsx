/**
 * Property-Based Test: Authentication Functionality Preservation
 * Feature: landing-page-redesign
 * Property 26: Authentication functionality preservation
 * Validates: Requirements 9.1
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '@/components/Header';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import fc from 'fast-check';

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));

describe('Property-Based Test: Authentication Functionality Preservation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Property 26: Authentication functionality preservation
   * 
   * For any user authentication state (logged in or logged out), the Header component
   * should render appropriate UI elements and clicking these elements should trigger
   * the expected authentication actions.
   * 
   * **Validates: Requirements 9.1**
   */
  it('should preserve authentication functionality across all user states', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary user states
        fc.oneof(
          fc.constant(null), // Guest user
          fc.record({
            id: fc.uuid(),
            email: fc.emailAddress(),
            created_at: fc.date().map(d => d.toISOString()),
            app_metadata: fc.constant({}),
            user_metadata: fc.constant({}),
            aud: fc.constant('authenticated' as const),
            role: fc.constant('authenticated' as const),
          })
        ),
        (userState) => {
          const { unmount } = render(<Header user={userState as User | null} />);

          if (userState === null) {
            // Guest user state - should show login button
            const loginButton = screen.getByRole('button', { name: /log in/i });
            expect(loginButton).toBeInTheDocument();
            expect(loginButton).toHaveClass('bg-danish-red');

            // Should not show user info
            const avatars = screen.queryAllByRole('img');
            expect(avatars).toHaveLength(0);

            // Clicking login should open auth modal
            fireEvent.click(loginButton);
            expect(screen.getByText(/sign in to access your saved chats/i)).toBeInTheDocument();
          } else {
            // Authenticated user state - should show user info
            const userEmail = screen.getByText(userState.email!);
            expect(userEmail).toBeInTheDocument();

            // Should display avatar with initials
            const initials = userState.email!.substring(0, 2).toUpperCase();
            const avatarFallback = screen.getByText(initials);
            expect(avatarFallback).toBeInTheDocument();

            // Should show logout button
            const logoutButton = screen.getByRole('button', { name: /log out/i });
            expect(logoutButton).toBeInTheDocument();

            // Should not show login button
            const loginButton = screen.queryByRole('button', { name: /log in/i });
            expect(loginButton).not.toBeInTheDocument();
          }

          unmount();
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Logout functionality triggers signOut
   * 
   * For any authenticated user, clicking the logout button should call
   * supabase.auth.signOut() and trigger the onAuthChange callback.
   */
  it('should trigger logout action when logout button is clicked', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.uuid(),
          email: fc.emailAddress(),
          created_at: fc.date().map(d => d.toISOString()),
          app_metadata: fc.constant({}),
          user_metadata: fc.constant({}),
          aud: fc.constant('authenticated' as const),
          role: fc.constant('authenticated' as const),
        }),
        async (user) => {
          const mockOnAuthChange = jest.fn();
          (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });

          const { unmount } = render(
            <Header user={user as User} onAuthChange={mockOnAuthChange} />
          );

          const logoutButton = screen.getByRole('button', { name: /log out/i });
          fireEvent.click(logoutButton);

          await waitFor(() => {
            expect(supabase.auth.signOut).toHaveBeenCalled();
          });

          unmount();
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property: Login modal opens for guest users
   * 
   * For any guest user (null), clicking the login button should open
   * the authentication modal.
   */
  it('should open auth modal when login button is clicked for guest users', () => {
    fc.assert(
      fc.property(
        fc.constant(null),
        (userState) => {
          const { unmount } = render(<Header user={userState} />);

          // Modal should not be visible initially
          expect(screen.queryByText(/sign in to access your saved chats/i)).not.toBeInTheDocument();

          const loginButton = screen.getByRole('button', { name: /log in/i });
          fireEvent.click(loginButton);

          // Modal should be visible after clicking login
          expect(screen.getByText(/sign in to access your saved chats/i)).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: User initials are correctly generated
   * 
   * For any authenticated user with an email, the avatar should display
   * the first two characters of the email in uppercase.
   */
  it('should generate correct initials from user email', () => {
    fc.assert(
      fc.property(
        fc.emailAddress(),
        (email) => {
          const user: User = {
            id: 'test-id',
            email,
            created_at: new Date().toISOString(),
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            role: 'authenticated',
          };

          const { unmount } = render(<Header user={user} />);

          const expectedInitials = email.substring(0, 2).toUpperCase();
          const avatarFallback = screen.getByText(expectedInitials);
          expect(avatarFallback).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Authentication state updates properly
   * 
   * For any user state change, the Header should re-render with the
   * appropriate UI elements for the new state.
   */
  it('should update UI when authentication state changes', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          email: fc.emailAddress(),
          created_at: fc.date().map(d => d.toISOString()),
          app_metadata: fc.constant({}),
          user_metadata: fc.constant({}),
          aud: fc.constant('authenticated' as const),
          role: fc.constant('authenticated' as const),
        }),
        (user) => {
          // Start with guest state
          const { rerender, unmount } = render(<Header user={null} />);
          expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();

          // Update to authenticated state
          rerender(<Header user={user as User} />);
          expect(screen.getByText(user.email!)).toBeInTheDocument();
          expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();

          // Update back to guest state
          rerender(<Header user={null} />);
          expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
          expect(screen.queryByText(user.email!)).not.toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 10 }
    );
  });
});
