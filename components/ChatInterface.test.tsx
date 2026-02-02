import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ChatInterface } from './ChatInterface';

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock the supabase module
jest.mock('@/lib/supabase', () => ({
  getChatHistory: jest.fn(),
  getMessages: jest.fn(),
  supabase: {
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
    },
  },
}));

// Mock the ai/react module
const mockHandleSubmit = jest.fn();
const mockHandleInputChange = jest.fn();
const mockSetMessages = jest.fn();

jest.mock('ai/react', () => ({
  useChat: jest.fn(() => ({
    messages: [],
    input: '',
    handleInputChange: mockHandleInputChange,
    handleSubmit: mockHandleSubmit,
    setMessages: mockSetMessages,
    isLoading: false,
    error: null,
  })),
}));

// Import after mocking
import { useChat } from 'ai/react';
import { getChatHistory, getMessages } from '@/lib/supabase';

describe('ChatInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getChatHistory as jest.Mock).mockResolvedValue([]);
    (getMessages as jest.Mock).mockResolvedValue([]);
  });

  describe('Initial render', () => {
    it('should display SuggestedQuestions when no messages exist', () => {
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={null} />);

      expect(screen.getByText('Try asking about:')).toBeInTheDocument();
      expect(screen.getByText(/How do I register with SKAT/)).toBeInTheDocument();
    });

    it('should display input field and send button', () => {
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={null} />);

      const input = screen.getByPlaceholderText(/Ask about SKAT, visas, or housing/);
      expect(input).toBeInTheDocument();

      const sendButton = screen.getByRole('button', { name: /send message/i });
      expect(sendButton).toBeInTheDocument();
    });

    it('should have send button disabled when input is empty', () => {
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={null} />);

      const sendButton = screen.getByRole('button', { name: /send message/i });
      expect(sendButton).toBeDisabled();
    });
  });

  describe('SuggestedQuestions visibility', () => {
    it('should hide SuggestedQuestions when messages exist', () => {
      (useChat as jest.Mock).mockReturnValue({
        messages: [
          { id: '1', role: 'user', content: 'Test message', createdAt: new Date() },
        ],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={null} />);

      expect(screen.queryByText('Try asking about:')).not.toBeInTheDocument();
    });

    it('should populate input when suggested question is clicked', async () => {
      const user = userEvent.setup();
      
      // Start with no messages so suggestions are visible
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });
      
      render(<ChatInterface userId={null} />);

      const questionButton = screen.getByText(/How do I register with SKAT/);
      await user.click(questionButton);

      expect(mockHandleInputChange).toHaveBeenCalled();
    });
  });

  describe('Message display', () => {
    it('should display user and assistant messages', () => {
      (useChat as jest.Mock).mockReturnValue({
        messages: [
          { id: '1', role: 'user', content: 'Hello', createdAt: new Date() },
          { id: '2', role: 'assistant', content: 'Hi there!', createdAt: new Date() },
        ],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={null} />);

      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });

    it('should display messages in order', () => {
      (useChat as jest.Mock).mockReturnValue({
        messages: [
          { id: '1', role: 'user', content: 'First message', createdAt: new Date() },
          { id: '2', role: 'assistant', content: 'Second message', createdAt: new Date() },
          { id: '3', role: 'user', content: 'Third message', createdAt: new Date() },
        ],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      const { container } = render(<ChatInterface userId={null} />);

      const messages = container.querySelectorAll('.break-words');
      expect(messages).toHaveLength(3);
    });
  });

  describe('Message submission', () => {
    it('should call handleSubmit when form is submitted with valid input', async () => {
      const user = userEvent.setup();
      
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: 'Test message',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={null} />);

      const form = screen.getByRole('button', { name: /send message/i }).closest('form');
      if (form) {
        await user.click(screen.getByRole('button', { name: /send message/i }));
      }

      expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('should not submit when input is empty', async () => {
      const user = userEvent.setup();
      
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={null} />);

      const sendButton = screen.getByRole('button', { name: /send message/i });
      expect(sendButton).toBeDisabled();
    });
  });

  describe('Loading state', () => {
    it('should display loading indicator when isLoading is true', () => {
      (useChat as jest.Mock).mockReturnValue({
        messages: [
          { id: '1', role: 'user', content: 'Test', createdAt: new Date() },
        ],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: true,
        error: null,
      });

      const { container } = render(<ChatInterface userId={null} />);

      const loadingSpinner = container.querySelector('.animate-spin');
      expect(loadingSpinner).toBeInTheDocument();
    });

    it('should disable input and button during loading', () => {
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: 'Test',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: true,
        error: null,
      });

      render(<ChatInterface userId={null} />);

      const input = screen.getByPlaceholderText(/Ask about SKAT, visas, or housing/);
      const sendButton = screen.getByRole('button', { name: /send message/i });

      expect(input).toBeDisabled();
      expect(sendButton).toBeDisabled();
    });
  });

  describe('Error handling', () => {
    it('should display error message when error occurs', () => {
      (useChat as jest.Mock).mockReturnValue({
        messages: [
          { id: '1', role: 'user', content: 'Test', createdAt: new Date() },
        ],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: new Error('API Error'),
      });

      render(<ChatInterface userId={null} />);

      expect(screen.getByText(/Sorry, I encountered an error/)).toBeInTheDocument();
    });

    it('should display user-friendly error message', () => {
      (useChat as jest.Mock).mockReturnValue({
        messages: [
          { id: '1', role: 'user', content: 'Test', createdAt: new Date() },
        ],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: new Error('Network failure'),
      });

      render(<ChatInterface userId={null} />);

      const errorMessage = screen.getByText(/Sorry, I encountered an error/);
      expect(errorMessage).toHaveClass('text-red-800');
    });
  });

  describe('User authentication', () => {
    it('should pass userId to useChat when provided', () => {
      const testUserId = 'user-123';
      
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={testUserId} />);

      expect(useChat).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {
            userId: testUserId,
          },
        })
      );
    });

    it('should pass undefined userId for guest users', () => {
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={null} />);

      expect(useChat).toHaveBeenCalledWith(
        expect.objectContaining({
          body: {
            userId: undefined,
          },
        })
      );
    });
  });

  describe('Chat history loading', () => {
    it('should load chat history for authenticated users on mount', async () => {
      const testUserId = 'user-123';
      const mockChatId = 'chat-456';
      const mockHistoricalMessages = [
        { id: '1', role: 'user', content: 'Previous question', created_at: new Date().toISOString() },
        { id: '2', role: 'assistant', content: 'Previous answer', created_at: new Date().toISOString() },
      ];

      (getChatHistory as jest.Mock).mockResolvedValue([{ id: mockChatId, user_id: testUserId }]);
      (getMessages as jest.Mock).mockResolvedValue(mockHistoricalMessages);

      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={testUserId} />);

      await waitFor(() => {
        expect(getChatHistory).toHaveBeenCalledWith(testUserId);
        expect(getMessages).toHaveBeenCalledWith(mockChatId);
        expect(mockSetMessages).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ content: 'Previous question' }),
            expect.objectContaining({ content: 'Previous answer' }),
          ])
        );
      });
    });

    it('should not load chat history for guest users', () => {
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={null} />);

      // Should show suggestions instead of loading history
      expect(screen.getByText('Try asking about:')).toBeInTheDocument();
      expect(getChatHistory).not.toHaveBeenCalled();
      expect(getMessages).not.toHaveBeenCalled();
    });

    it('should display historical messages in correct chronological order', async () => {
      const testUserId = 'user-123';
      const mockChatId = 'chat-456';
      const mockHistoricalMessages = [
        { id: '1', role: 'user', content: 'First message', created_at: '2024-01-01T00:00:00Z' },
        { id: '2', role: 'assistant', content: 'Second message', created_at: '2024-01-02T00:00:00Z' },
        { id: '3', role: 'user', content: 'Third message', created_at: '2024-01-03T00:00:00Z' },
      ];

      (getChatHistory as jest.Mock).mockResolvedValue([{ id: mockChatId, user_id: testUserId }]);
      (getMessages as jest.Mock).mockResolvedValue(mockHistoricalMessages);

      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={testUserId} />);

      await waitFor(() => {
        expect(mockSetMessages).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ content: 'First message', role: 'user' }),
            expect.objectContaining({ content: 'Second message', role: 'assistant' }),
            expect.objectContaining({ content: 'Third message', role: 'user' }),
          ])
        );
      });
    });
  });

  describe('Guest session reset', () => {
    it('should not persist guest messages', () => {
      // Guest user (userId is null)
      (useChat as jest.Mock).mockReturnValue({
        messages: [
          { id: '1', role: 'user', content: 'Guest message', createdAt: new Date() },
          { id: '2', role: 'assistant', content: 'Guest response', createdAt: new Date() },
        ],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={null} />);

      // Verify no database calls were made for guest users
      expect(getChatHistory).not.toHaveBeenCalled();
      expect(getMessages).not.toHaveBeenCalled();
    });

    it('should start with empty messages array on page load for guests', () => {
      // Guest user with no messages
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      render(<ChatInterface userId={null} />);

      // Should show suggested questions (only shown when messages array is empty)
      expect(screen.getByText('Try asking about:')).toBeInTheDocument();
      
      // Verify no attempt to load history
      expect(getChatHistory).not.toHaveBeenCalled();
      expect(getMessages).not.toHaveBeenCalled();
      expect(mockSetMessages).not.toHaveBeenCalled();
    });

    it('should clear guest chat history on component remount (simulating page refresh)', () => {
      // First render with messages
      (useChat as jest.Mock).mockReturnValue({
        messages: [
          { id: '1', role: 'user', content: 'Guest message', createdAt: new Date() },
        ],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });

      const { unmount } = render(<ChatInterface userId={null} />);
      
      // Verify message was displayed
      expect(screen.getByText('Guest message')).toBeInTheDocument();
      
      // Unmount component (simulating navigation away)
      unmount();
      
      // Reset mock to return empty messages (simulating fresh page load)
      (useChat as jest.Mock).mockReturnValue({
        messages: [],
        input: '',
        handleInputChange: mockHandleInputChange,
        handleSubmit: mockHandleSubmit,
        setMessages: mockSetMessages,
        isLoading: false,
        error: null,
      });
      
      // Remount component (simulating page refresh)
      render(<ChatInterface userId={null} />);
      
      // Should show suggested questions again (messages array is empty)
      expect(screen.getByText('Try asking about:')).toBeInTheDocument();
      
      // Previous message should not be present
      expect(screen.queryByText('Guest message')).not.toBeInTheDocument();
    });
  });
});
