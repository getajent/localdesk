import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatMessage } from './ChatMessage';

describe('ChatMessage', () => {
  const mockTimestamp = new Date('2024-01-15T10:30:00');

  describe('User message styling and alignment', () => {
    it('should render user message with right alignment', () => {
      const { container } = render(
        <ChatMessage
          role="user"
          content="Hello, this is a user message"
          timestamp={mockTimestamp}
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('justify-end');
    });

    it('should render user message with Danish Red background', () => {
      const { container } = render(
        <ChatMessage
          role="user"
          content="Hello, this is a user message"
          timestamp={mockTimestamp}
        />
      );

      const messageBox = container.querySelector('.bg-danish-red');
      expect(messageBox).toBeInTheDocument();
      expect(messageBox).toHaveClass('text-white');
    });
  });

  describe('Assistant message styling and alignment', () => {
    it('should render assistant message with left alignment', () => {
      const { container } = render(
        <ChatMessage
          role="assistant"
          content="Hello, this is an assistant message"
          timestamp={mockTimestamp}
        />
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('justify-start');
    });

    it('should render assistant message with slate-100 background', () => {
      const { container } = render(
        <ChatMessage
          role="assistant"
          content="Hello, this is an assistant message"
          timestamp={mockTimestamp}
        />
      );

      const messageBox = container.querySelector('.bg-slate-100');
      expect(messageBox).toBeInTheDocument();
      expect(messageBox).toHaveClass('text-slate-900');
    });
  });

  describe('Timestamp rendering', () => {
    it('should display timestamp in correct format', () => {
      render(
        <ChatMessage
          role="user"
          content="Test message"
          timestamp={mockTimestamp}
        />
      );

      const timestamp = screen.getByText(/10:30/);
      expect(timestamp).toBeInTheDocument();
      expect(timestamp).toHaveClass('text-xs');
    });

    it('should display timestamp with appropriate styling for user messages', () => {
      const { container } = render(
        <ChatMessage
          role="user"
          content="Test message"
          timestamp={mockTimestamp}
        />
      );

      const timestamp = container.querySelector('.text-xs');
      expect(timestamp).toHaveClass('text-white/70');
    });

    it('should display timestamp with appropriate styling for assistant messages', () => {
      const { container } = render(
        <ChatMessage
          role="assistant"
          content="Test message"
          timestamp={mockTimestamp}
        />
      );

      const timestamp = container.querySelector('.text-xs');
      expect(timestamp).toHaveClass('text-gray-500');
    });
  });

  describe('Markdown rendering in assistant messages', () => {
    it('should render markdown in assistant messages', () => {
      render(
        <ChatMessage
          role="assistant"
          content="This is **bold** text"
          timestamp={mockTimestamp}
        />
      );

      const boldText = screen.getByText('bold');
      expect(boldText.tagName).toBe('STRONG');
    });

    it('should render markdown lists in assistant messages', () => {
      const markdownContent = `Here are the steps:
- First step
- Second step
- Third step`;

      render(
        <ChatMessage
          role="assistant"
          content={markdownContent}
          timestamp={mockTimestamp}
        />
      );

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
      expect(listItems[0]).toHaveTextContent('First step');
    });

    it('should not render markdown in user messages', () => {
      const { container } = render(
        <ChatMessage
          role="user"
          content="This is **bold** text"
          timestamp={mockTimestamp}
        />
      );

      const content = screen.getByText(/This is \*\*bold\*\* text/);
      expect(content).toBeInTheDocument();
      const strongElement = container.querySelector('strong');
      expect(strongElement).not.toBeInTheDocument();
    });
  });

  describe('Responsive layout', () => {
    it('should have responsive max-width classes', () => {
      const { container } = render(
        <ChatMessage
          role="user"
          content="Test message"
          timestamp={mockTimestamp}
        />
      );

      const messageBox = container.querySelector('.max-w-\\[90\\%\\]');
      expect(messageBox).toBeInTheDocument();
    });
  });
});
