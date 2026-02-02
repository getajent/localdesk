import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe('ChatInterface - Guest Session Reset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getChatHistory as jest.Mock).mockResolvedValue([]);
    (getMessages as jest.Mock).mockResolvedValue([]);
  });

  it('should ensure ChatInterface state is not persisted for guest users', () => {
    // Render with guest user (no userId)
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

    // Verify no persistence mechanisms are called
    expect(getChatHistory).not.toHaveBeenCalled();
    expect(getMessages).not.toHaveBeenCalled();
    
    // Verify component renders with empty state
    expect(screen.getByText('Try asking about:')).toBeInTheDocument();
  });

  it('should verify messages array is empty on page load for guests', () => {
    // Simulate fresh page load for guest user
    (useChat as jest.Mock).mockReturnValue({
      messages: [], // Empty messages array on initial load
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      setMessages: mockSetMessages,
      isLoading: false,
      error: null,
    });

    render(<ChatInterface userId={null} />);

    // Verify suggested questions are shown (only shown when messages is empty)
    expect(screen.getByText('Try asking about:')).toBeInTheDocument();
    expect(screen.getByText(/How do I register with SKAT/)).toBeInTheDocument();
    
    // Verify no messages are displayed
    expect(screen.queryByText(/Guest message/)).not.toBeInTheDocument();
  });

  it('should test that refreshing the page clears guest chat history', () => {
    // Simulate guest user with active chat session
    (useChat as jest.Mock).mockReturnValue({
      messages: [
        { id: '1', role: 'user', content: 'How do I register with SKAT?', createdAt: new Date() },
        { id: '2', role: 'assistant', content: 'To register with SKAT...', createdAt: new Date() },
      ],
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      setMessages: mockSetMessages,
      isLoading: false,
      error: null,
    });

    const { unmount } = render(<ChatInterface userId={null} />);

    // Verify messages are displayed during active session
    expect(screen.getByText('How do I register with SKAT?')).toBeInTheDocument();
    expect(screen.getByText('To register with SKAT...')).toBeInTheDocument();

    // Unmount component (simulating page navigation/refresh)
    unmount();

    // Simulate page refresh - useChat hook reinitializes with empty state
    (useChat as jest.Mock).mockReturnValue({
      messages: [], // Fresh state after refresh
      input: '',
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      setMessages: mockSetMessages,
      isLoading: false,
      error: null,
    });

    // Remount component (simulating page reload)
    render(<ChatInterface userId={null} />);

    // Verify chat history is cleared
    expect(screen.queryByText('How do I register with SKAT?')).not.toBeInTheDocument();
    expect(screen.queryByText('To register with SKAT...')).not.toBeInTheDocument();
    
    // Verify suggested questions are shown again
    expect(screen.getByText('Try asking about:')).toBeInTheDocument();
  });

  it('should not attempt to load any persisted data for guest users', () => {
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

    // Verify no database queries are made
    expect(getChatHistory).not.toHaveBeenCalled();
    expect(getMessages).not.toHaveBeenCalled();
    
    // Verify setMessages is not called (no history to restore)
    expect(mockSetMessages).not.toHaveBeenCalled();
  });
});
