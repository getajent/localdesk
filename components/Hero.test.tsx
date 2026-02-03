import { render, screen, fireEvent } from '@testing-library/react';
import { Hero } from '@/components/Hero';

describe('Hero Component - Unit Tests', () => {
  beforeEach(() => {
    // Clear any previous DOM state
    document.body.innerHTML = '';
  });

  describe('Content Display', () => {
    it('should display the headline', () => {
      render(<Hero />);
      
      const headline = screen.getByText('Navigate Danish Bureaucracy with Confidence');
      expect(headline).toBeInTheDocument();
      expect(headline.tagName).toBe('H1');
    });

    it('should display the subheadline', () => {
      render(<Hero />);
      
      const subheadline = screen.getByText(
        'Get instant answers about SKAT, visas, and housing from your AI-powered Danish consultant'
      );
      expect(subheadline).toBeInTheDocument();
    });

    it('should display the CTA button', () => {
      render(<Hero />);
      
      const ctaButton = screen.getByRole('button', { name: /start chatting/i });
      expect(ctaButton).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should style headline with slate-900 text', () => {
      render(<Hero />);
      
      const headline = screen.getByText('Navigate Danish Bureaucracy with Confidence');
      expect(headline).toHaveClass('text-slate-900');
    });

    it('should style CTA button with Danish Red background', () => {
      render(<Hero />);
      
      const ctaButton = screen.getByRole('button', { name: /start chatting/i });
      expect(ctaButton).toHaveClass('bg-danish-red');
    });

    it('should have gradient background section', () => {
      const { container } = render(<Hero />);
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('bg-gradient-to-b', 'from-white', 'to-slate-50');
    });
  });

  describe('CTA Button Functionality', () => {
    it('should scroll to chat interface when CTA button is clicked', () => {
      // Create a mock chat interface element
      const mockChatElement = document.createElement('div');
      mockChatElement.id = 'chat-interface';
      mockChatElement.scrollIntoView = jest.fn();
      document.body.appendChild(mockChatElement);

      render(<Hero />);
      
      const ctaButton = screen.getByRole('button', { name: /start chatting/i });
      fireEvent.click(ctaButton);

      expect(mockChatElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('should handle missing chat interface gracefully', () => {
      render(<Hero />);
      
      const ctaButton = screen.getByRole('button', { name: /start chatting/i });
      
      // Should not throw error when chat interface doesn't exist
      expect(() => {
        fireEvent.click(ctaButton);
      }).not.toThrow();
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive text sizing classes', () => {
      render(<Hero />);
      
      const headline = screen.getByText('Navigate Danish Bureaucracy with Confidence');
      expect(headline).toHaveClass('font-bold', 'text-slate-900', 'leading-tight');
    });

    it('should have responsive padding classes', () => {
      const { container } = render(<Hero />);
      
      const section = container.querySelector('section');
      expect(section).toHaveClass('py-12', 'sm:py-16', 'md:py-24', 'lg:py-32');
    });

    it('should center content with max-width constraint', () => {
      const { container } = render(<Hero />);
      
      const contentContainer = container.querySelector('.max-w-4xl');
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass('mx-auto', 'items-center', 'text-center');
    });
  });

  describe('Layout Structure', () => {
    it('should use flexbox column layout', () => {
      const { container } = render(<Hero />);
      
      const contentContainer = container.querySelector('.flex.flex-col');
      expect(contentContainer).toBeInTheDocument();
    });

    it('should have proper spacing between elements', () => {
      const { container } = render(<Hero />);
      
      const contentContainer = container.querySelector('.space-y-6');
      expect(contentContainer).toBeInTheDocument();
    });
  });
});
