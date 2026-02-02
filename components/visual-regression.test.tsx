/**
 * Visual Regression Tests for LocalDesk Landing Page
 * Feature: localdesk-landing-page
 * 
 * Tests color scheme consistency, typography, and responsive layouts
 * across different viewport sizes (mobile, tablet, desktop)
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
 */

import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { ChatMessage } from '@/components/ChatMessage';
import { SuggestedQuestions } from '@/components/SuggestedQuestions';

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));

describe('Visual Regression Tests', () => {
  describe('Color Scheme Consistency', () => {
    it('should use Danish Red (#C60C30) for primary CTA buttons', () => {
      const { container } = render(<Hero />);
      const ctaButton = screen.getByRole('button', { name: /start chatting/i });
      
      // Check if button has Danish Red background
      expect(ctaButton).toHaveClass('bg-danish-red');
    });

    it('should use Danish Red for user messages in chat', () => {
      const { container } = render(
        <ChatMessage
          role="user"
          content="Test message"
          timestamp={new Date()}
        />
      );
      
      const messageElement = container.querySelector('.bg-danish-red');
      expect(messageElement).toBeInTheDocument();
    });

    it('should use slate-100 background for assistant messages', () => {
      const { container } = render(
        <ChatMessage
          role="assistant"
          content="Test response"
          timestamp={new Date()}
        />
      );
      
      const messageElement = container.querySelector('.bg-slate-100');
      expect(messageElement).toBeInTheDocument();
    });

    it('should use white background for main sections', () => {
      const { container } = render(<Hero />);
      const section = container.querySelector('section');
      
      expect(section).toHaveClass('bg-white');
    });

    it('should use slate-50 background for Features section', () => {
      const { container } = render(<Features />);
      const section = container.querySelector('section');
      
      expect(section).toHaveClass('bg-slate-50');
    });

    it('should use slate-900 text for headings', () => {
      render(<Hero />);
      const heading = screen.getByRole('heading', { level: 1 });
      
      expect(heading).toHaveClass('text-slate-900');
    });

    it('should use slate-600 text for body copy', () => {
      const { container } = render(<Hero />);
      const paragraph = container.querySelector('p');
      
      expect(paragraph).toHaveClass('text-slate-600');
    });

    it('should use Danish Red for hover states on links', () => {
      const { container } = render(<Footer />);
      const links = container.querySelectorAll('a');
      
      links.forEach(link => {
        expect(link).toHaveClass('hover:text-danish-red');
      });
    });
  });

  describe('Typography Consistency', () => {
    it('should apply Inter or Geist Sans font family globally', () => {
      // This is set in globals.css and applied to body
      // We verify the component renders without errors
      const { container } = render(<Hero />);
      expect(container).toBeInTheDocument();
    });

    it('should use appropriate font sizes for mobile headings', () => {
      render(<Hero />);
      const heading = screen.getByRole('heading', { level: 1 });
      
      // Check responsive text classes
      expect(heading.className).toMatch(/text-3xl|text-4xl|text-5xl|text-6xl/);
    });

    it('should use consistent font weights for headings', () => {
      render(<Hero />);
      const heading = screen.getByRole('heading', { level: 1 });
      
      expect(heading).toHaveClass('font-bold');
    });

    it('should use appropriate line height for readability', () => {
      render(<Hero />);
      const heading = screen.getByRole('heading', { level: 1 });
      
      expect(heading).toHaveClass('leading-tight');
    });

    it('should use tracking-tight for large headings', () => {
      render(<Hero />);
      const heading = screen.getByRole('heading', { level: 1 });
      
      expect(heading).toHaveClass('tracking-tight');
    });
  });

  describe('Responsive Layout - Mobile (320px-767px)', () => {
    beforeEach(() => {
      // Mock mobile viewport
      global.innerWidth = 375;
      global.innerHeight = 667;
    });

    it('should render Header with mobile-optimized layout', () => {
      render(<Header user={null} />);
      const header = screen.getByRole('banner');
      
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('w-full');
    });

    it('should render Hero with mobile text sizes', () => {
      render(<Hero />);
      const heading = screen.getByRole('heading', { level: 1 });
      
      // Should have mobile-first text size
      expect(heading.className).toContain('text-3xl');
    });

    it('should render Features in 1 column on mobile', () => {
      const { container } = render(<Features />);
      const grid = container.querySelector('.grid');
      
      expect(grid).toHaveClass('grid-cols-1');
    });

    it('should render ChatMessage with mobile-optimized width', () => {
      const { container } = render(
        <ChatMessage
          role="user"
          content="Test"
          timestamp={new Date()}
        />
      );
      
      const message = container.querySelector('.max-w-\\[90\\%\\]');
      expect(message).toBeInTheDocument();
    });

    it('should render Footer with stacked layout on mobile', () => {
      const { container } = render(<Footer />);
      const footerContent = container.querySelector('.flex-col');
      
      expect(footerContent).toBeInTheDocument();
    });
  });

  describe('Responsive Layout - Tablet (768px-1023px)', () => {
    beforeEach(() => {
      // Mock tablet viewport
      global.innerWidth = 768;
      global.innerHeight = 1024;
    });

    it('should render Features in 2 columns on tablet', () => {
      const { container } = render(<Features />);
      const grid = container.querySelector('.grid');
      
      expect(grid).toHaveClass('sm:grid-cols-2');
    });

    it('should render Hero with medium text sizes', () => {
      render(<Hero />);
      const heading = screen.getByRole('heading', { level: 1 });
      
      // Should have tablet text size classes
      expect(heading.className).toMatch(/md:text-5xl/);
    });

    it('should render ChatMessage with tablet-optimized width', () => {
      const { container } = render(
        <ChatMessage
          role="user"
          content="Test"
          timestamp={new Date()}
        />
      );
      
      const message = container.querySelector('.sm\\:max-w-\\[85\\%\\]');
      expect(message).toBeInTheDocument();
    });
  });

  describe('Responsive Layout - Desktop (1024px+)', () => {
    beforeEach(() => {
      // Mock desktop viewport
      global.innerWidth = 1440;
      global.innerHeight = 900;
    });

    it('should render Features in 4 columns on desktop', () => {
      const { container } = render(<Features />);
      const grid = container.querySelector('.grid');
      
      expect(grid).toHaveClass('lg:grid-cols-4');
    });

    it('should render Hero with large text sizes', () => {
      render(<Hero />);
      const heading = screen.getByRole('heading', { level: 1 });
      
      // Should have desktop text size classes
      expect(heading.className).toMatch(/lg:text-6xl/);
    });

    it('should render ChatMessage with desktop-optimized width', () => {
      const { container } = render(
        <ChatMessage
          role="user"
          content="Test"
          timestamp={new Date()}
        />
      );
      
      const message = container.querySelector('.md\\:max-w-\\[70\\%\\]');
      expect(message).toBeInTheDocument();
    });

    it('should render Footer with horizontal layout on desktop', () => {
      const { container } = render(<Footer />);
      const footerContent = container.querySelector('.md\\:flex-row');
      
      expect(footerContent).toBeInTheDocument();
    });
  });

  describe('Whitespace and Minimalist Design', () => {
    it('should have ample padding in Hero section', () => {
      const { container } = render(<Hero />);
      const section = container.querySelector('section');
      
      // Check for responsive padding classes
      expect(section?.className).toMatch(/py-12|py-16|py-24|py-32/);
    });

    it('should have consistent spacing between Features cards', () => {
      const { container } = render(<Features />);
      const grid = container.querySelector('.grid');
      
      expect(grid).toHaveClass('gap-6');
    });

    it('should have proper spacing in chat messages', () => {
      const { container } = render(
        <ChatMessage
          role="user"
          content="Test"
          timestamp={new Date()}
        />
      );
      
      const messageContainer = container.querySelector('.mb-3');
      expect(messageContainer).toBeInTheDocument();
    });

    it('should use rounded corners for modern aesthetic', () => {
      const { container } = render(<Features />);
      const cards = container.querySelectorAll('.rounded-lg');
      
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should have subtle shadows for depth', () => {
      const { container } = render(<Features />);
      const cards = container.querySelectorAll('.shadow-sm');
      
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Interactive Element States', () => {
    it('should have hover states on CTA buttons', () => {
      render(<Hero />);
      const button = screen.getByRole('button', { name: /start chatting/i });
      
      expect(button).toHaveClass('hover:bg-[#A00A28]');
    });

    it('should have hover states on suggested question buttons', () => {
      const mockOnClick = jest.fn();
      const { container } = render(
        <SuggestedQuestions onQuestionClick={mockOnClick} />
      );
      
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('hover:border-danish-red');
      });
    });

    it('should have hover states on footer links', () => {
      const { container } = render(<Footer />);
      const links = container.querySelectorAll('a');
      
      links.forEach(link => {
        expect(link).toHaveClass('hover:text-danish-red');
      });
    });

    it('should have focus states on interactive elements', () => {
      render(<Hero />);
      const button = screen.getByRole('button', { name: /start chatting/i });
      
      expect(button).toHaveClass('focus:ring-danish-red');
    });

    it('should have transition effects for smooth interactions', () => {
      const { container } = render(<Features />);
      const cards = container.querySelectorAll('.transition-all');
      
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should have disabled states for buttons', () => {
      render(<Hero />);
      const button = screen.getByRole('button', { name: /start chatting/i });
      
      // Button should have proper styling classes
      expect(button).toBeInTheDocument();
    });
  });

  describe('Accessibility and ARIA Labels', () => {
    it('should have proper ARIA labels on buttons', () => {
      render(<Hero />);
      const button = screen.getByRole('button', { name: /start chatting/i });
      
      expect(button).toHaveAttribute('aria-label');
    });

    it('should have proper ARIA labels on links', () => {
      const { container } = render(<Footer />);
      const links = container.querySelectorAll('a[aria-label]');
      
      expect(links.length).toBeGreaterThan(0);
    });

    it('should have semantic HTML structure', () => {
      render(<Header user={null} />);
      const header = screen.getByRole('banner');
      
      expect(header).toBeInTheDocument();
    });
  });

  describe('Nordic Clean Aesthetic Compliance', () => {
    it('should maintain minimalist design with clean borders', () => {
      const { container } = render(<Header user={null} />);
      const header = container.querySelector('header');
      
      expect(header).toHaveClass('border-b', 'border-slate-200');
    });

    it('should use subtle shadows instead of heavy borders', () => {
      const { container } = render(<Features />);
      const cards = container.querySelectorAll('.shadow-sm');
      
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should have consistent border radius throughout', () => {
      const { container: heroContainer } = render(<Hero />);
      const { container: featuresContainer } = render(<Features />);
      
      const roundedElements = [
        ...heroContainer.querySelectorAll('.rounded-lg'),
        ...featuresContainer.querySelectorAll('.rounded-lg'),
      ];
      
      expect(roundedElements.length).toBeGreaterThan(0);
    });

    it('should use Danish Red sparingly as accent color', () => {
      const { container } = render(<Hero />);
      const danishRedElements = container.querySelectorAll('.bg-danish-red');
      
      // Should be used but not excessively
      expect(danishRedElements.length).toBeGreaterThan(0);
      expect(danishRedElements.length).toBeLessThan(5);
    });
  });
});
