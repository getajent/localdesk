/**
 * Property-Based Test: Chat Interface Responsiveness
 * Feature: localdesk-landing-page, Property 14: Chat Interface Responsiveness
 * Validates: Requirements 12.4
 * 
 * Property: For any viewport width (mobile, tablet, desktop), 
 * the chat interface should remain functional with proper input and message display.
 */

import { render, screen } from '@testing-library/react';
import { ChatInterface } from './ChatInterface';
import fc from 'fast-check';

// Mock the ai/react hook
jest.mock('ai/react', () => ({
  useChat: () => ({
    messages: [],
    input: '',
    handleInputChange: jest.fn(),
    handleSubmit: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

describe('Property 14: Chat Interface Responsiveness', () => {
  it('should remain functional across all viewport widths', () => {
    fc.assert(
      fc.property(
        // Generate viewport widths: mobile (320-767), tablet (768-1023), desktop (1024+)
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          // Set viewport width
          global.innerWidth = viewportWidth;
          
          // Render the component
          const { container } = render(<ChatInterface userId={null} />);
          
          // Verify chat interface container exists
          const chatContainer = container.querySelector('.flex.flex-col');
          expect(chatContainer).toBeInTheDocument();
          
          // Verify input field is present and functional
          const inputField = screen.getByPlaceholderText(/Ask about SKAT, visas, or housing/i);
          expect(inputField).toBeInTheDocument();
          expect(inputField).not.toBeDisabled();
          
          // Verify submit button is present
          const submitButton = screen.getByRole('button', { name: /submit/i });
          expect(submitButton).toBeInTheDocument();
          
          // Verify the container has proper height constraint
          expect(chatContainer).toHaveClass('h-[600px]');
          
          // Verify messages container is scrollable
          const messagesContainer = container.querySelector('.overflow-y-auto');
          expect(messagesContainer).toBeInTheDocument();
        }
      ),
      { numRuns: 20 }
    );
  });

  it('should maintain proper layout structure at different viewport sizes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { width: 375, name: 'mobile' },
          { width: 768, name: 'tablet' },
          { width: 1024, name: 'desktop' },
          { width: 1920, name: 'large-desktop' }
        ),
        (viewport) => {
          global.innerWidth = viewport.width;
          
          const { container } = render(<ChatInterface userId={null} />);
          
          // Verify max-width constraint
          const wrapper = container.querySelector('.max-w-4xl');
          expect(wrapper).toBeInTheDocument();
          
          // Verify flex layout
          const flexContainer = container.querySelector('.flex.flex-col');
          expect(flexContainer).toBeInTheDocument();
          
          // Verify input form is at the bottom
          const form = container.querySelector('form');
          expect(form).toBeInTheDocument();
          expect(form?.parentElement).toHaveClass('border-t');
        }
      ),
      { numRuns: 20 }
    );
  });
});
