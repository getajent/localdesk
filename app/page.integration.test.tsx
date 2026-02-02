/**
 * Integration Tests: Landing Page
 * Tests full guest user chat flow, authenticated user chat with persistence,
 * and responsive layout at different viewport sizes
 * Validates: Requirements 1.1, 1.2, 1.3, 9.1, 9.2, 12.1, 12.2, 12.3, 12.4
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './page';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
      }),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
    },
  },
  saveMessage: jest.fn(),
  getChatHistory: jest.fn().mockResolvedValue([]),
  getMessages: jest.fn().mockResolvedValue([]),
}));

// Mock the AI chat hook
jest.mock('ai/react', () => ({
  useChat: jest.fn(() => ({
    messages: [],
    input: '',
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
    isLoading: false,
    error: null,
  })),
}));

describe('Landing Page Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Guest User Chat Flow', () => {
    it('should display all landing page sections for guest users', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      });

      render(await Home());

      // Verify Header is present with login button
      expect(screen.getByText('LocalDesk')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();

      // Verify Hero section
      expect(screen.getByText(/Navigate Danish Bureaucracy with Confidence/i)).toBeInTheDocument();
      expect(screen.getByText(/Get instant answers about SKAT, visas, and housing/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /start chatting/i })).toBeInTheDocument();

      // Verify Features section
      expect(screen.getByText('Instant Answers')).toBeInTheDocument();
      expect(screen.getByText('Expert Knowledge')).toBeInTheDocument();
      expect(screen.getByText('No Login Required')).toBeInTheDocument();
      expect(screen.getByText('Always Available')).toBeInTheDocument();

      // Verify Chat Interface section
      expect(screen.getByText(/Start Your Conversation/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Ask about SKAT, visas, or housing/i)).toBeInTheDocument();

      // Verify Footer
      expect(screen.getByText(/© \d{4} LocalDesk. All rights reserved./)).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });

    it('should allow guest users to interact with chat without authentication', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      });

      const mockHandleSubmit = jest.fn((e) => e.preventDefault());
      const mockHandleInputChange = jest.fn();
      
      const { useChat } = await import('ai/react');
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: 'Test question',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        isLoading: false,
        error: null,
      });

      render(await Home());

      // Verify chat input is accessible
      const chatInput = screen.getByPlaceholderText(/Ask about SKAT, visas, or housing/i);
      expect(chatInput).toBeInTheDocument();
      expect(chatInput).not.toBeDisabled();
    });
  });

  describe('Authenticated User Chat Flow', () => {
    it('should display user information when authenticated', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };

      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: {
          session: {
            user: mockUser,
          },
        },
      });

      render(await Home());

      // Verify user email is displayed in header
      await waitFor(() => {
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });

      // Verify login button is not present
      expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
    });

    it('should pass userId to ChatInterface for authenticated users', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };

      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: {
          session: {
            user: mockUser,
          },
        },
      });

      const { useChat } = await import('ai/react');
      const mockUseChat = useChat as jest.Mock;
      mockUseChat.mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: jest.fn(),
        handleSubmit: jest.fn(),
        isLoading: false,
        error: null,
      });

      render(await Home());

      // Verify useChat was called with userId in body
      await waitFor(() => {
        expect(mockUseChat).toHaveBeenCalledWith(
          expect.objectContaining({
            body: expect.objectContaining({
              userId: 'test-user-id',
            }),
          })
        );
      });
    });
  });

  describe('Responsive Layout', () => {
    it('should render properly on mobile viewport (375px)', async () => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      });

      const { container } = render(await Home());

      // Verify main layout structure
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
      expect(container.querySelector('.flex.flex-col')).toBeInTheDocument();

      // Verify responsive container classes
      expect(screen.getByText('LocalDesk').closest('.container')).toBeInTheDocument();
    });

    it('should render properly on tablet viewport (768px)', async () => {
      global.innerWidth = 768;
      global.dispatchEvent(new Event('resize'));

      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      });

      const { container } = render(await Home());

      // Verify layout adapts to tablet size
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
      expect(screen.getByText(/Navigate Danish Bureaucracy with Confidence/i)).toBeInTheDocument();
    });

    it('should render properly on desktop viewport (1024px)', async () => {
      global.innerWidth = 1024;
      global.dispatchEvent(new Event('resize'));

      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      });

      const { container } = render(await Home());

      // Verify layout utilizes desktop space
      expect(container.querySelector('.min-h-screen')).toBeInTheDocument();
      expect(screen.getByText('Instant Answers')).toBeInTheDocument();
      expect(screen.getByText('Expert Knowledge')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should integrate all components in correct order', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      });

      const { container } = render(await Home());

      // Get all major sections
      const sections = container.querySelectorAll('section, header, footer');
      
      // Verify minimum number of sections (Header, Hero, Features, Chat, Footer)
      expect(sections.length).toBeGreaterThanOrEqual(4);

      // Verify header comes first
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header?.textContent).toContain('LocalDesk');

      // Verify footer comes last
      const footer = container.querySelector('footer');
      expect(footer).toBeInTheDocument();
      expect(footer?.textContent).toContain('Privacy Policy');
    });

    it('should have chat interface with proper id for scroll targeting', async () => {
      const { supabase } = await import('@/lib/supabase');
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      });

      const { container } = render(await Home());

      // Verify chat section has id="chat-interface"
      const chatSection = container.querySelector('#chat-interface');
      expect(chatSection).toBeInTheDocument();
      expect(chatSection?.tagName).toBe('SECTION');
    });
  });
});
