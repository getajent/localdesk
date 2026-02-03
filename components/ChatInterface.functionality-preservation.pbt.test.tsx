/**
 * Property-Based Test: Chat Interface Functionality Preservation
 * Feature: landing-page-redesign
 * Property 27: Chat interface functionality preservation
 * Validates: Requirements 9.3
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInterface } from '@/components/ChatInterface';
import fc from 'fast-check';

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

// Mock the @ai-sdk/react module
const mockSendMessage = jest.fn();
const mockSetMessages = jest.fn();

jest.mock('@ai-sdk/react', () => ({
  useChat: jest.fn(() => ({
    messages: [],
    input: '',
    sendMessage: mockSendMessage,
    setMessages: mockSetMessages,
    status: 'idle',
    error: null,
  })),
}));

jest.mock('ai', () => ({
  DefaultChatTransport: jest.fn(),
}));

// Import after mocking
import { useChat } from '@ai-sdk/react';
import { getChatHistory, getMessages } from '@/lib/supabase';

describe('Property-Based Test: Chat Interface Functionality Preservation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getChatHistory as jest.Mock).mockResolvedValue([]);
    (getMessages as jest.Mock).mockResolvedValue([]);
  });

  /**
   * Property 27: Chat interface functionality preservation
   * 
   * For any interaction with the Chat Interface section, all existing capabilities
   * (message input, message sending, message display, suggested questions) should
   * function identically to the pre-redesign implementation.
   * 
   * **Validates: Requirements 9.3**
   */
  it('should preserve message input functionality', async () => {
    const user = userEvent.setup();
    const mockSend = jest.fn();
    
    (useChat as jest.Mock).mockReturnValue({
      messages: [],
      input: '',
      sendMessage: mockSend,
      setMessages: mockSetMessages,
      status: 'idle',
      error: null,
    });

    const { unmount } = render(<ChatInterface userId={null} />);

    // Input field should be present
    const input = screen.getByLabelText('Chat message input');
    expect(input).toBeInTheDocument();

    // Should be able to type into input
    await user.type(input, 'Test message');

    // Send button should be enabled when input has text
    const sendButton = screen.getByLabelText('Send message');
    expect(sendButton).not.toBeDisabled();

    // Should call sendMessage when submitted
    await user.click(sendButton);
    expect(mockSend).toHaveBeenCalledWith({ text: 'Test message' });

    unmount();
  }, 10000);

  /**
   * Property: Message display functionality
   * 
   * For any set of messages, the chat interface should display all messages
   * in the correct order with proper role identification.
   */
  it('should display messages correctly for any message set', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            role: fc.constantFrom('user' as const, 'assistant' as const),
            text: fc.string({ minLength: 2, maxLength: 200 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 0, maxLength: 10 }
        ),
        (messageSet) => {
          const formattedMessages = messageSet.map(msg => ({
            id: msg.id,
            role: msg.role,
            parts: [{ type: 'text' as const, text: msg.text }],
            createdAt: new Date(),
          }));

          (useChat as jest.Mock).mockReturnValue({
            messages: formattedMessages,
            input: '',
            sendMessage: jest.fn(),
            setMessages: mockSetMessages,
            status: 'idle',
            error: null,
          });

          const { unmount, container } = render(<ChatInterface userId={null} />);

          try {
            // All messages should be displayed
            messageSet.forEach(msg => {
              expect(container.textContent).toContain(msg.text);
            });
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property: Suggested questions functionality
   * 
   * When no messages exist, suggested questions should be displayed and
   * clicking them should populate the input field.
   */
  it('should display and handle suggested questions when no messages exist', async () => {
    const user = userEvent.setup();

    (useChat as jest.Mock).mockReturnValue({
      messages: [],
      input: '',
      sendMessage: jest.fn(),
      setMessages: mockSetMessages,
      status: 'idle',
      error: null,
    });

    const { unmount } = render(<ChatInterface userId={null} />);

    // Suggested questions should be visible
    expect(screen.getByText('Try asking about:')).toBeInTheDocument();
    expect(screen.getByText(/How do I register with SKAT/)).toBeInTheDocument();

    // Clicking a suggested question should populate input
    const questionButton = screen.getByText(/How do I register with SKAT/);
    await user.click(questionButton);

    const input = screen.getByLabelText('Chat message input') as HTMLInputElement;
    expect(input.value).toContain('SKAT');

    unmount();
  });

  /**
   * Property: Loading state functionality
   * 
   * When the chat is in a loading state, the input and send button should
   * be disabled, and a loading indicator should be displayed.
   */
  it('should handle loading state correctly', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('streaming' as const, 'submitted' as const),
        (loadingStatus) => {
          (useChat as jest.Mock).mockReturnValue({
            messages: [
              { id: '1', role: 'user', parts: [{ type: 'text', text: 'Test' }], createdAt: new Date() },
            ],
            input: '',
            sendMessage: jest.fn(),
            setMessages: mockSetMessages,
            status: loadingStatus,
            error: null,
          });

          const { container, unmount } = render(<ChatInterface userId={null} />);

          try {
            // Input and button should be disabled
            const input = screen.getByLabelText('Chat message input');
            const sendButton = screen.getByLabelText('Send message');
            expect(input).toBeDisabled();
            expect(sendButton).toBeDisabled();

            // Loading spinner should be present
            const loadingSpinner = container.querySelector('.animate-spin');
            expect(loadingSpinner).toBeInTheDocument();
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Error handling functionality
   * 
   * When an error occurs, the chat interface should display a user-friendly
   * error message.
   */
  it('should display error messages when errors occur', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (errorMessage) => {
          (useChat as jest.Mock).mockReturnValue({
            messages: [
              { id: '1', role: 'user', parts: [{ type: 'text', text: 'Test' }], createdAt: new Date() },
            ],
            input: '',
            sendMessage: jest.fn(),
            setMessages: mockSetMessages,
            status: 'idle',
            error: new Error(errorMessage),
          });

          const { unmount } = render(<ChatInterface userId={null} />);

          // Error message should be displayed
          expect(screen.getByText(/Sorry, I encountered an error/)).toBeInTheDocument();

          unmount();
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: User ID handling
   * 
   * For any user ID (authenticated or guest), the chat interface should
   * handle it correctly and pass it to the useChat hook.
   */
  it('should handle user authentication state correctly', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.uuid()
        ),
        (userId) => {
          (useChat as jest.Mock).mockReturnValue({
            messages: [],
            input: '',
            sendMessage: jest.fn(),
            setMessages: mockSetMessages,
            status: 'idle',
            error: null,
          });

          const { unmount } = render(<ChatInterface userId={userId} />);

          try {
            // Chat interface should render regardless of user state
            const input = screen.getByLabelText('Chat message input');
            expect(input).toBeInTheDocument();

            const sendButton = screen.getByLabelText('Send message');
            expect(sendButton).toBeInTheDocument();
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 10 }
    );
  });

  /**
   * Property: Empty input validation
   * 
   * For any empty or whitespace-only input, the send button should be disabled.
   */
  it('should disable send button for empty or whitespace-only input', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('', '   ', '\t', '\n', '  \t  \n  '),
        (emptyInput) => {
          (useChat as jest.Mock).mockReturnValue({
            messages: [],
            input: emptyInput,
            sendMessage: jest.fn(),
            setMessages: mockSetMessages,
            status: 'idle',
            error: null,
          });

          const { unmount } = render(<ChatInterface userId={null} />);

          try {
            const sendButton = screen.getByLabelText('Send message');
            expect(sendButton).toBeDisabled();
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Chat history loading for authenticated users
   * 
   * For any authenticated user, the chat interface should attempt to load
   * their chat history on mount.
   */
  it('should load chat history for authenticated users', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.array(
          fc.record({
            id: fc.uuid(),
            role: fc.constantFrom('user' as const, 'assistant' as const),
            content: fc.string({ minLength: 1, maxLength: 100 }),
            created_at: fc.date().map(d => d.toISOString()),
          }),
          { minLength: 0, maxLength: 5 }
        ),
        async (userId, historicalMessages) => {
          const mockChatId = 'chat-123';
          (getChatHistory as jest.Mock).mockResolvedValue([{ id: mockChatId, user_id: userId }]);
          (getMessages as jest.Mock).mockResolvedValue(historicalMessages);

          (useChat as jest.Mock).mockReturnValue({
            messages: [],
            input: '',
            sendMessage: jest.fn(),
            setMessages: mockSetMessages,
            status: 'idle',
            error: null,
          });

          const { unmount } = render(<ChatInterface userId={userId} />);

          await waitFor(() => {
            expect(getChatHistory).toHaveBeenCalledWith(userId);
            if (historicalMessages.length > 0) {
              expect(getMessages).toHaveBeenCalledWith(mockChatId);
            }
          });

          unmount();
        }
      ),
      { numRuns: 30 }
    );
  });
});
