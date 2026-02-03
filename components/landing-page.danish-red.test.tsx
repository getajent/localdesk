/**
 * Unit Test: Danish Red Brand Color Presence
 * Feature: landing-page-redesign, Property 11: Danish Red brand color presence
 * Validates: Requirements 4.1
 * 
 * Property: For any rendered Landing Page, the color #C8102E (Danish Red) should 
 * appear in the computed styles of at least one primary action element (button or link).
 */

import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';
import { Header } from './Header';
import { Footer } from './Footer';
import { PageClient } from './PageClient';

// Mock ChatInterface to avoid AI SDK dependencies
jest.mock('./ChatInterface', () => ({
  ChatInterface: ({ userId }: { userId?: string | null }) => (
    <div data-testid="chat-interface">
      <input placeholder="Ask about SKAT, visas, or housing..." />
      <button>Send</button>
    </div>
  ),
}));

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

// Helper function to check if element has Danish Red class
const hasDanishRedClass = (element: Element): boolean => {
  const classList = Array.from(element.classList);
  return classList.some(cls => 
    cls.includes('danish-red') ||
    cls === 'bg-danish-red' ||
    cls === 'text-danish-red' ||
    cls === 'border-danish-red' ||
    cls === 'ring-danish-red' ||
    cls.includes('hover:text-danish-red') ||
    cls.includes('hover:bg-danish-red') ||
    cls.includes('hover:ring-danish-red')
  );
};

describe('Property 11: Danish Red brand color presence', () => {
  describe('Hero Section', () => {
    it('should use Danish Red for the primary CTA button', () => {
      render(<Hero />);
      
      const ctaButton = screen.getByRole('button', { name: /start chatting/i });
      expect(ctaButton).toBeInTheDocument();
      
      // Button should have Danish Red background class
      expect(hasDanishRedClass(ctaButton)).toBe(true);
      expect(ctaButton).toHaveClass('bg-danish-red');
    });

    it('should maintain Danish Red on CTA button hover state', () => {
      render(<Hero />);
      
      const ctaButton = screen.getByRole('button', { name: /start chatting/i });
      
      // Check for hover state class (darker shade of Danish Red)
      const classList = Array.from(ctaButton.classList);
      const hasHoverState = classList.some(cls => cls.includes('hover:bg-'));
      
      expect(hasHoverState).toBe(true);
    });
  });

  describe('Header Section', () => {
    it('should use Danish Red for login button when user is not authenticated', () => {
      render(<Header user={null} />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      expect(loginButton).toBeInTheDocument();
      
      // Login button should have Danish Red background
      expect(hasDanishRedClass(loginButton)).toBe(true);
      expect(loginButton).toHaveClass('bg-danish-red');
    });

    it('should use Danish Red for avatar ring hover state when user is authenticated', () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };
      
      const { container } = render(<Header user={mockUser} />);
      
      // Avatar should have Danish Red hover ring
      const avatar = container.querySelector('[class*="ring-"]');
      expect(avatar).toBeInTheDocument();
      
      const classList = Array.from(avatar!.classList);
      const hasRedRingHover = classList.some(cls => cls.includes('hover:ring-danish-red'));
      
      expect(hasRedRingHover).toBe(true);
    });
  });

  describe('Footer Section', () => {
    it('should use Danish Red for link hover states', () => {
      render(<Footer />);
      
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      const termsLink = screen.getByRole('link', { name: /terms of service/i });
      const contactLink = screen.getByRole('link', { name: /contact/i });
      
      // All links should have Danish Red hover state
      [privacyLink, termsLink, contactLink].forEach(link => {
        expect(hasDanishRedClass(link)).toBe(true);
        
        const classList = Array.from(link.classList);
        const hasRedHover = classList.some(cls => cls.includes('hover:text-danish-red'));
        expect(hasRedHover).toBe(true);
      });
    });

    it('should use Danish Red for link underline animation', () => {
      render(<Footer />);
      
      const links = [
        screen.getByRole('link', { name: /privacy policy/i }),
        screen.getByRole('link', { name: /terms of service/i }),
        screen.getByRole('link', { name: /contact/i }),
      ];
      
      links.forEach(link => {
        const classList = Array.from(link.classList);
        
        // Check for after pseudo-element with Danish Red background
        const hasAfterElement = classList.some(cls => cls.includes('after:bg-danish-red'));
        expect(hasAfterElement).toBe(true);
      });
    });
  });

  describe('Full Page Integration', () => {
    it('should have Danish Red present in at least one primary action element', () => {
      render(<PageClient initialUser={null} />);
      
      // Check for any button or link with Danish Red
      const buttons = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');
      
      const elementsWithDanishRed = [...buttons, ...links].filter(element => 
        hasDanishRedClass(element)
      );
      
      // At least one element should use Danish Red
      expect(elementsWithDanishRed.length).toBeGreaterThanOrEqual(1);
    });

    it('should use Danish Red consistently across all primary actions', () => {
      render(<PageClient initialUser={null} />);
      
      // Primary CTA button in Hero
      const ctaButton = screen.getByRole('button', { name: /start chatting/i });
      expect(hasDanishRedClass(ctaButton)).toBe(true);
      
      // Login button in Header
      const loginButton = screen.getByRole('button', { name: /log in/i });
      expect(hasDanishRedClass(loginButton)).toBe(true);
      
      // Footer links
      const footerLinks = [
        screen.getByRole('link', { name: /privacy policy/i }),
        screen.getByRole('link', { name: /terms of service/i }),
        screen.getByRole('link', { name: /contact/i }),
      ];
      
      footerLinks.forEach(link => {
        expect(hasDanishRedClass(link)).toBe(true);
      });
    });

    it('should maintain Danish Red as the primary brand color', () => {
      const { container } = render(<PageClient initialUser={null} />);
      
      // Count elements with Danish Red
      const allElements = container.querySelectorAll('*');
      const elementsWithDanishRed = Array.from(allElements).filter(element => 
        hasDanishRedClass(element)
      );
      
      // Should have multiple elements using Danish Red
      expect(elementsWithDanishRed.length).toBeGreaterThanOrEqual(3);
    });

    it('should use Danish Red for focus states on interactive elements', () => {
      render(<PageClient initialUser={null} />);
      
      const ctaButton = screen.getByRole('button', { name: /start chatting/i });
      const loginButton = screen.getByRole('button', { name: /log in/i });
      
      // Check for focus ring classes
      [ctaButton, loginButton].forEach(button => {
        const classList = Array.from(button.classList);
        const hasFocusRing = classList.some(cls => 
          cls.includes('focus:ring-danish-red') || cls.includes('focus-visible:ring-danish-red')
        );
        
        expect(hasFocusRing).toBe(true);
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should maintain Danish Red across different viewport sizes', () => {
      const viewports = [375, 768, 1024, 1920];
      
      viewports.forEach(width => {
        global.innerWidth = width;
        global.dispatchEvent(new Event('resize'));
        
        const { container } = render(<PageClient initialUser={null} />);
        
        // Danish Red should be present regardless of viewport
        const allElements = container.querySelectorAll('*');
        const elementsWithDanishRed = Array.from(allElements).filter(element => 
          hasDanishRedClass(element)
        );
        
        expect(elementsWithDanishRed.length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
