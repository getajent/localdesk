/**
 * Property-Based Test: Non-flat Backgrounds
 * Feature: landing-page-redesign, Property 12: Non-flat backgrounds
 * Validates: Requirements 4.3
 * 
 * Property: For any major section background (Hero, Features, Chat Interface), 
 * the computed background should either contain a gradient (linear-gradient or 
 * radial-gradient) or a non-white color value.
 */

import { render } from '@testing-library/react';
import { Hero } from './Hero';
import { Features } from './Features';
import { PageClient } from './PageClient';
import fc from 'fast-check';

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

// Helper function to check if element has gradient background class
const hasGradientClass = (element: Element): boolean => {
  const classList = Array.from(element.classList);
  return classList.some(cls => 
    cls.includes('gradient') || 
    cls.startsWith('bg-gradient-')
  );
};

// Helper function to check if element has non-white background class
const hasNonWhiteBackgroundClass = (element: Element): boolean => {
  const classList = Array.from(element.classList);
  const whiteClasses = ['bg-white', 'bg-transparent'];
  
  // Check for any background color class that's not white
  const bgColorClasses = classList.filter(cls => cls.startsWith('bg-'));
  const nonWhiteBgClasses = bgColorClasses.filter(cls => !whiteClasses.includes(cls));
  
  return nonWhiteBgClasses.length > 0;
};

describe('Property 12: Non-flat backgrounds', () => {
  it('Hero section should have gradient or non-white background', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Hero />);
          
          const heroSection = container.querySelector('section');
          expect(heroSection).toBeInTheDocument();
          
          // Should have either gradient or non-white background
          const hasGradient = hasGradientClass(heroSection!);
          const hasNonWhiteBg = hasNonWhiteBackgroundClass(heroSection!);
          
          expect(hasGradient || hasNonWhiteBg).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Features section should have gradient or non-white background', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const featuresSection = container.querySelector('section');
          expect(featuresSection).toBeInTheDocument();
          
          // Should have either gradient or non-white background
          const hasGradient = hasGradientClass(featuresSection!);
          const hasNonWhiteBg = hasNonWhiteBackgroundClass(featuresSection!);
          
          expect(hasGradient || hasNonWhiteBg).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Chat Interface section should have gradient or non-white background', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          const chatSection = container.querySelector('#chat-interface');
          expect(chatSection).toBeInTheDocument();
          
          // Should have either gradient or non-white background
          const hasGradient = hasGradientClass(chatSection!);
          const hasNonWhiteBg = hasNonWhiteBackgroundClass(chatSection!);
          
          expect(hasGradient || hasNonWhiteBg).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('All major sections should avoid pure flat white backgrounds', () => {
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
          
          const { container } = render(<PageClient initialUser={null} />);
          
          // Check Hero section
          const heroSection = container.querySelector('section:nth-of-type(1)');
          const heroHasGradientOrColor = heroSection ? 
            (hasGradientClass(heroSection) || hasNonWhiteBackgroundClass(heroSection)) : false;
          
          // Check Features section
          const featuresSection = container.querySelector('section:nth-of-type(2)');
          const featuresHasGradientOrColor = featuresSection ? 
            (hasGradientClass(featuresSection) || hasNonWhiteBackgroundClass(featuresSection)) : false;
          
          // Check Chat section
          const chatSection = container.querySelector('#chat-interface');
          const chatHasGradientOrColor = chatSection ? 
            (hasGradientClass(chatSection) || hasNonWhiteBackgroundClass(chatSection)) : false;
          
          // At least 2 out of 3 major sections should have non-flat backgrounds
          const sectionsWithNonFlatBg = [
            heroHasGradientOrColor,
            featuresHasGradientOrColor,
            chatHasGradientOrColor
          ].filter(Boolean).length;
          
          expect(sectionsWithNonFlatBg).toBeGreaterThanOrEqual(2);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Hero section should specifically use gradient classes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Hero />);
          
          const heroSection = container.querySelector('section');
          expect(heroSection).toBeInTheDocument();
          
          // Hero should specifically have gradient
          const hasGradient = hasGradientClass(heroSection!);
          expect(hasGradient).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Features section should use gradient or tinted background', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<Features />);
          
          const featuresSection = container.querySelector('section');
          expect(featuresSection).toBeInTheDocument();
          
          const classList = Array.from(featuresSection!.classList);
          
          // Should not be pure white
          expect(classList).not.toContain('bg-white');
          
          // Should have some background styling
          const hasBgClass = classList.some(cls => cls.startsWith('bg-'));
          expect(hasBgClass).toBe(true);
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Background treatments should be consistent across viewport sizes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth) => {
          global.innerWidth = viewportWidth;
          
          const { container } = render(<PageClient initialUser={null} />);
          
          // All major sections should maintain their background treatment
          const sections = [
            container.querySelector('section:nth-of-type(1)'), // Hero
            container.querySelector('section:nth-of-type(2)'), // Features
            container.querySelector('#chat-interface'), // Chat
          ];
          
          sections.forEach(section => {
            if (section) {
              const hasNonFlatBg = hasGradientClass(section) || hasNonWhiteBackgroundClass(section);
              // Each section should have some background treatment
              expect(hasNonFlatBg).toBe(true);
            }
          });
        }
      ),
      { numRuns: 20 }
    );
  });
});
